using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Models;
using ReactApp1.Server.Models;

namespace pro.Server.Services
{
    public class AuditDetailService
    {
        private readonly SafetyAdviceDB _context;

        public AuditDetailService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public async Task<List<AuditFullDetails>> GetAuditDetailByCounselorId(string CounselorsId)
        {
            var audits = await _context.AuditDetails
                .Where(a => a.counselorId == CounselorsId)
                .Select(audit => new
                {
                    audit,
                    kg = _context.Kindergartens
                    .Where(k => k.code == audit.kindergartenCode)
                    .OrderByDescending(k => k.seqNr)
                    .FirstOrDefault()
                })
                .Where(x => x.kg != null)
                .Select(x => new
                {
                    audit = x.audit,
                    kg = x.kg,
                    nanny = _context.Nannies
                        .FirstOrDefault(n => n.kindergartenCode == x.kg.code),
                    hub = _context.Hubs
                        .FirstOrDefault(h => h.id == x.kg.hubId),
                    org = _context.Organizations
                        .FirstOrDefault(o => o.id == x.kg.organizationsId)
                })
                .Select(a => new AuditFullDetails
                {
                    auditDetail = a.audit,
                    kindergarten = new KindergartenViewModel
                    {
                        code = a.kg.code,
                        street = a.kg.street,
                        homeNum = a.kg.homeNum,
                        floor = a.kg.floor,
                        hubId = a.kg.hubId,
                        city = a.kg.city == null ? null : new City
                        {
                            cityCode = a.kg.city.cityCode,
                            name = a.kg.city.name
                        }
                    },
                    organization = new OrganizationViewModel
                    {
                        organizationId = a.kg.organizationsId,
                        name = a.org != null ? a.org.name : string.Empty
                    },
                    nanny = new NannyViewModel
                    {
                        id = a.nanny != null ? a.nanny.id : string.Empty,
                        firstName = a.nanny != null ? a.nanny.firstName : string.Empty,
                        lastName = a.nanny != null ? a.nanny.lastName : string.Empty
                    },
                    hub = new HubViewModel
                    {
                        id = a.hub != null ? a.hub.id : string.Empty,
                        firstName = a.hub != null ? a.hub.firstName : string.Empty,
                        lastName = a.hub != null ? a.hub.lastName : string.Empty
                    }
                })
                .Distinct()  // מוודא שכל מבדק מופיע פעם אחת בלבד
                .ToListAsync();

            return audits;
        }

        public async Task<AuditFullDetails?> GetAuditDetailById(int auditId)
        {
            var audit = await _context.AuditDetails
                .Where(a => a.id == auditId)
                .Join(_context.Kindergartens,
                      ad => ad.kindergartenCode,
                      kg => kg.code,
                      (ad, kg) => new { ad, kg })
                .Join(_context.Nannies,
                      temp => temp.kg.code,
                      nanny => nanny.kindergartenCode,
                      (temp, nanny) => new { temp.ad, temp.kg, nanny })
                .Join(_context.Hubs,
                      temp => temp.kg.hubId,
                      hub => hub.id,
                      (temp, hub) => new { temp.ad, temp.kg, temp.nanny, hub })
                .Join(_context.Organizations,
                      temp => temp.kg.organizationsId,
                      org => org.id,
                      (temp, org) => new { temp.ad, temp.kg, temp.nanny, temp.hub, org })
                .Select(a => new AuditFullDetails
                {
                    auditDetail = a.ad,
                    kindergarten = new KindergartenViewModel
                    {
                        code = a.kg.id,
                        street = a.kg.street,
                        homeNum = a.kg.homeNum,
                        floor = a.kg.floor,
                        hubId = a.kg.hubId,
                        city = a.kg.city == null ? null : new City
                        {
                            cityCode = a.kg.city.cityCode,
                            name = a.kg.city.name
                        }
                    },
                    organization = a.org == null ? null : new OrganizationViewModel
                    {
                        organizationId = a.kg.organizationsId,
                        name = a.org.name,
                    },
                    nanny = a.nanny == null ? null : new NannyViewModel
                    {
                        id = a.nanny.id,
                        firstName = a.nanny.firstName,
                        lastName = a.nanny.lastName,
                    },
                    hub = a.hub == null ? null : new HubViewModel
                    {
                        id = a.hub.id,
                        firstName = a.hub.firstName,
                        lastName = a.hub.lastName,
                    }
                })
                .FirstOrDefaultAsync();

            return audit;
        }

        public async Task<List<QuestionWithAnswerViewModel>> GetQuestionsWithAnswersByAuditId(int auditId)
        {
            try
            {
                // שליפת כל התשובות של המבדק
                var answers = await _context.Audits
                    .Where(a => a.auditId == auditId)
                    .ToListAsync();

                var questionIds = answers.Select(a => a.questionId).ToList();

                // שליפת כל השאלות המתאימות
                var questionsDict = await _context.Questions
                    .Where(q => questionIds.Contains(q.id))
                    .ToDictionaryAsync(q => q.id, q => q);

                // שליפת כל האפשרויות לכל שאלה
                var optionsDict = await _context.AnswerOptions
                    .Where(o => questionIds.Contains(o.questionId) && o.option != null)
                    .GroupBy(o => o.questionId)
                    .ToDictionaryAsync(g => g.Key, g => g.Select(o => o.option.Trim()).ToList());

                var result = new List<QuestionWithAnswerViewModel>();
                foreach (var answer in answers)
                {
                    questionsDict.TryGetValue(answer.questionId, out var question);
                    optionsDict.TryGetValue(answer.questionId, out var options);
                    result.Add(new QuestionWithAnswerViewModel
                    {
                        questionId = answer.questionId,
                        questionText = question?.question ?? string.Empty,
                        answer = answer.answer?.Trim() ?? string.Empty,
                        options = options ?? new List<string>(),
                        questionType = "רגילה"
                    });
                }

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetQuestionsWithAnswersByAuditId: {ex.Message}\n{ex.StackTrace}");
                return new List<QuestionWithAnswerViewModel>();
            }
        }

        public async Task<FullAuditWithQuestionsViewModel?> GetFullAuditWithQuestionsById(int auditId)
        {
            try
            {
                // 1. Get audit details
                var audit = await GetAuditDetailById(auditId);
                if (audit == null)
                {
                    Console.WriteLine($"❌ Audit {auditId} not found");
                    return null;
                }

                var questions = new List<QuestionWithAnswerViewModel>();

                // 2. Get regular questions with their answers
                var regularQuestions = await (
                    from a in _context.Audits
                    join q in _context.Questions on a.questionId equals q.id
                    where a.auditId == auditId
                    select new
                    {
                        QuestionId = q.id,
                        QuestionText = q.question,
                        Answer = a.answer,
                        Img = a.img,
                        Priority = a.priority,
                        AnswerOptions = _context.AnswerOptions
                            .Where(o => o.questionId == q.id)
                            .Select(o => new AnswerOptionViewModel
                            {
                                id = o.id,
                                option = o.option
                            })
                            .ToList()
                    }).ToListAsync();

                foreach (var q in regularQuestions)
                {
                    questions.Add(new QuestionWithAnswerViewModel
                    {
                        questionId = q.QuestionId,
                        questionText = q.QuestionText ?? string.Empty,
                        answer = q.Answer ?? string.Empty,
                        img = q.Img ?? string.Empty,
                        priority = q.Priority,
                        options = q.AnswerOptions.Select(o => o.option).ToList(),
                        answerOptions = q.AnswerOptions,
                        questionType = "רגילה"
                    });
                }

                // 3. Get space questions with their answers
                Console.WriteLine($"🔍 Querying space questions for audit {auditId}...");

                var spaceQuestions = await (
                    from a in _context.QuestionsForSpaceAudits
                    join q in _context.QuestionsForSpace on a.questionId equals q.id
                    where a.auditId == auditId
                    select new
                    {
                        QuestionId = q.id,
                        QuestionText = q.question,
                        Answer = a.answer,
                        Img = a.img,
                        Priority = a.priority,
                        AnswerOptions = _context.AnswerOptionsForSpace
                            .Where(o => o.questionId == q.id)
                            .Select(o => new AnswerOptionViewModel
                            {
                                id = o.id,
                                option = o.option
                            })
                            .ToList()
                    }).ToListAsync();

                foreach (var q in spaceQuestions)
                {
                    questions.Add(new QuestionWithAnswerViewModel
                    {
                        questionId = q.QuestionId,
                        questionText = q.QuestionText ?? string.Empty,
                        answer = q.Answer ?? string.Empty,
                        img = q.Img ?? string.Empty,
                        priority = q.Priority,
                        options = q.AnswerOptions.Select(o => o.option).ToList(),
                        answerOptions = q.AnswerOptions,
                        questionType = "מרחב"
                    });
                }

                // Debug log
                Console.WriteLine($"Found {regularQuestions.Count} regular questions and {spaceQuestions.Count} space questions");
                foreach (var q in questions)
                {
                    Console.WriteLine($"Question {q.questionId}: Type={q.questionType}, Answer='{q.answer}', Priority={q.priority}, Options=[{string.Join(", ", q.options)}]");
                }

                return new FullAuditWithQuestionsViewModel
                {
                    audit = audit,
                    questions = questions
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetFullAuditWithQuestionsById: {ex.Message}\n{ex.StackTrace}");
                throw;
            }
        }

        // AuditDetailService.cs

        public async Task<bool> UpdateFullAuditWithQuestions(int auditId, FullAuditWithQuestionsViewModel model)
        {
            try
            {
                // 1. עדכון פרטי המבדק הראשי (אם צריך)
                var auditDetail = await _context.AuditDetails
                    .FirstOrDefaultAsync(a => a.id == auditId);

                if (auditDetail == null)
                {
                    Console.WriteLine($"Audit with ID {auditId} not found");
                    return false;
                }

                // עדכון תאריך העדכון לתאריך היום
                auditDetail.updateDate = DateTime.Now;

                // 2. עדכון השאלות והתשובות
                foreach (var questionModel in model.questions)
                {
                    // בדיקה האם זו שאלה רגילה (טבלת Audits)
                    var regularAudit = await _context.Audits
                        .FirstOrDefaultAsync(a => a.auditId == auditId && a.questionId == questionModel.questionId);

                    if (regularAudit != null)
                    {
                        // עדכון שאלה רגילה
                        regularAudit.answer = questionModel.answer;
                        regularAudit.img = questionModel.img ?? string.Empty;
                        regularAudit.priority = questionModel.priority;
                    }
                    else
                    {
                        // בדיקה האם זו שאלה של מרחב (טבלת QuestionsForSpaceAudits)
                        var spaceAudit = await _context.QuestionsForSpaceAudits
                            .FirstOrDefaultAsync(a => a.auditId == auditId && a.questionId == questionModel.questionId);

                        if (spaceAudit != null)
                        {
                            // עדכון שאלה של מרחב
                            spaceAudit.answer = questionModel.answer;
                            spaceAudit.img = questionModel.img ?? string.Empty;
                            spaceAudit.priority = questionModel.priority;
                        }
                        else
                        {
                            // אם לא קיימת – מוסיפים לפי סוג השאלה
                            if (questionModel.questionType == "מרחב")
                            {
                                _context.QuestionsForSpaceAudits.Add(new ReactApp1.Server.Classes.QuestionsForSpaceAudit
                                {
                                    auditId = auditId,
                                    questionId = questionModel.questionId,
                                    answer = questionModel.answer,
                                    img = questionModel.img ?? string.Empty,
                                    priority = questionModel.priority
                                });
                            }
                            else // רגילה
                            {
                                _context.Audits.Add(new Audit
                                {
                                    auditId = auditId,
                                    questionId = questionModel.questionId,
                                    answer = questionModel.answer,
                                    img = questionModel.img ?? string.Empty,
                                    priority = questionModel.priority
                                });
                            }
                        }
                    }
                }

                // 3. שמירת השינויים במאגר הנתונים
                await _context.SaveChangesAsync();

                Console.WriteLine("Audit and questions updated successfully");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating audit: {ex.Message}\n{ex.StackTrace}");
                return false;
            }
        }

        // פונקציה חדשה לעדכון סטטוס אישור ותוקף
        public async Task<bool> UpdateAuditApprovalStatus(int auditId, int approvalStatus)
        {
            try
            {
                var auditDetail = await _context.AuditDetails
                    .FirstOrDefaultAsync(a => a.id == auditId);

                if (auditDetail == null)
                {
                    Console.WriteLine($"Audit with ID {auditId} not found");
                    return false;
                }

                auditDetail.approvalStatus = approvalStatus;
                auditDetail.updateDate = DateTime.Now;

                // עדכון תוקף רק אם המבדק מאושר
                if (approvalStatus == 1)
                {
                    switch (auditDetail.type)
                    {
                        case 1: // מבדק שנתי
                            auditDetail.validity = DateTime.Now.AddYears(1);
                            break;
                        case 2: // פתיחת שנה
                            auditDetail.validity = DateTime.Now.AddYears(1);
                            break;
                        case 3: // מילוי מקום - 16 שבועות
                            auditDetail.validity = DateTime.Now.AddDays(16 * 7); // 16 שבועות = 112 ימים
                            break;
                        default:
                            auditDetail.validity = DateTime.Now;
                            break;
                    }
                }
                else
                {
                    // אם המבדק לא מאושר, אפס את התוקף
                    auditDetail.validity = DateTime.Now;
                }

                await _context.SaveChangesAsync();
                Console.WriteLine($"Audit {auditId} approval status updated to {approvalStatus}, validity: {auditDetail.validity}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating audit approval status: {ex.Message}\n{ex.StackTrace}");
                return false;
            }
        }

        // פונקציה חדשה לעדכון סוג המבדק
        public async Task<bool> UpdateAuditType(int auditId, int type)
        {
            try
            {
                var auditDetail = await _context.AuditDetails
                    .FirstOrDefaultAsync(a => a.id == auditId);

                if (auditDetail == null)
                {
                    Console.WriteLine($"Audit with ID {auditId} not found");
                    return false;
                }

                auditDetail.type = type;
                auditDetail.updateDate = DateTime.Now;

                // עדכון תוקף אוטומטית אם המבדק מאושר
                if (auditDetail.approvalStatus == 1)
                {
                    switch (type)
                    {
                        case 1: // מבדק שנתי
                            auditDetail.validity = DateTime.Now.AddYears(1);
                            break;
                        case 2: // פתיחת שנה
                            auditDetail.validity = DateTime.Now.AddYears(1);
                            break;
                        case 3: // מילוי מקום - 16 שבועות
                            auditDetail.validity = DateTime.Now.AddDays(16 * 7);
                            break;
                        default:
                            auditDetail.validity = DateTime.Now;
                            break;
                    }
                }

                await _context.SaveChangesAsync();
                Console.WriteLine($"Audit {auditId} type updated to {type}, validity: {auditDetail.validity}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating audit type: {ex.Message}\n{ex.StackTrace}");
                return false;
            }
        }

        public async Task<List<AuditFullDetails>> GetAuditDetailsWithFilters(
            string? counselorId = null,
            string? organizationId = null, 
            int? cityCode = null,
            string? hubId = null,
            string? nannyId = null,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            string? searchText = null,
            int? approvalStatus = null)
        {
            var query = _context.AuditDetails.AsQueryable();

            // סינון לפי יועץ אם צוין
            if (!string.IsNullOrEmpty(counselorId))
            {
                query = query.Where(a => a.counselorId == counselorId);
            }

            // סינון לפי תאריך
            if (fromDate.HasValue)
            {
                query = query.Where(a => a.auditDate.Date >= fromDate.Value.Date);
            }

            if (toDate.HasValue)
            {
                query = query.Where(a => a.auditDate.Date <= toDate.Value.Date);
            }

            // סינון לפי סטטוס אישור
            if (approvalStatus.HasValue)
            {
                query = query.Where(a => a.approvalStatus == approvalStatus.Value);
            }

            var audits = await query
                .Select(audit => new
                {
                    audit,
                    kg = _context.Kindergartens
                        .Where(k => k.code == audit.kindergartenCode)
                        .OrderByDescending(k => k.seqNr)
                        .FirstOrDefault()
                })
                .Where(x => x.kg != null)
                .Select(x => new
                {
                    audit = x.audit,
                    kg = x.kg,
                    nanny = _context.Nannies
                        .FirstOrDefault(n => n.kindergartenCode == x.kg.code),
                    hub = _context.Hubs
                        .FirstOrDefault(h => h.id == x.kg.hubId),
                    org = _context.Organizations
                        .FirstOrDefault(o => o.id == x.kg.organizationsId),
                    counselor = _context.Counselors
                        .FirstOrDefault(c => c.id == x.audit.counselorId)
                })
                // סינונים נוספים
                .Where(x => 
                    (string.IsNullOrEmpty(organizationId) || x.kg.organizationsId == organizationId) &&
                    (!cityCode.HasValue || x.kg.city.cityCode == cityCode.Value) &&
                    (string.IsNullOrEmpty(hubId) || x.kg.hubId == hubId) &&
                    (string.IsNullOrEmpty(nannyId) || x.nanny.id == nannyId)
                )
                .ToListAsync();

            // סינון לפי טקסט חיפוש (שם או ת"ז)
            if (!string.IsNullOrEmpty(searchText))
            {
                searchText = searchText.ToLower();
                audits = audits.Where(x =>
                    (x.nanny != null && (
                        x.nanny.id.ToLower().Contains(searchText) ||
                        x.nanny.firstName.ToLower().Contains(searchText) ||
                        x.nanny.lastName.ToLower().Contains(searchText)
                    )) ||
                    (x.counselor != null && (
                        x.counselor.id.ToLower().Contains(searchText) ||
                        x.counselor.firstName.ToLower().Contains(searchText) ||
                        x.counselor.lastName.ToLower().Contains(searchText)
                    ))
                ).ToList();
            }

            return audits.Select(a => new AuditFullDetails
            {
                auditDetail = a.audit,
                kindergarten = new KindergartenViewModel
                {
                    code = a.kg.code,
                    street = a.kg.street,
                    homeNum = a.kg.homeNum,
                    floor = a.kg.floor,
                    hubId = a.kg.hubId,
                    city = a.kg.city == null ? null : new City
                    {
                        cityCode = a.kg.city.cityCode,
                        name = a.kg.city.name
                    }
                },
                organization = new OrganizationViewModel
                {
                    organizationId = a.kg.organizationsId,
                    name = a.org != null ? a.org.name : string.Empty
                },
                nanny = new NannyViewModel
                {
                    id = a.nanny != null ? a.nanny.id : string.Empty,
                    firstName = a.nanny != null ? a.nanny.firstName : string.Empty,
                    lastName = a.nanny != null ? a.nanny.lastName : string.Empty
                },
                hub = new HubViewModel
                {
                    id = a.hub != null ? a.hub.id : string.Empty,
                    firstName = a.hub != null ? a.hub.firstName : string.Empty,
                    lastName = a.hub != null ? a.hub.lastName : string.Empty
                },
                counselor = a.counselor
            })
            .Distinct()
            .ToList();
        }
        //public async Task<bool> UpdateFullAuditWithQuestions(int auditId, FullAuditWithQuestionsViewModel model)
        //{
        //    try
        //    {
        //        // חיפוש המבדק לפי מזהה
        //        var auditDetail = await _context.AuditDetails
        //            .Include(a => _context.Audits)  // מביא את השאלות הקשורות למבדק
        //            .FirstOrDefaultAsync(a => a.id == auditId);

        //        if (auditDetail == null)
        //        {
        //            Console.WriteLine($"Audit with ID {auditId} not found");
        //            return false;
        //        }

        //        // עדכון פרטי המבדק
        //      //  auditDetail.auditDetail = model.audit.auditDetail;
        //        auditDetail.kindergartenCode = model.audit.kindergarten.code;
        //        auditDetail.counselorId = model.audit.counselor.id;
        //      //  auditDetail.organization = model.audit.organization;
        //       // auditDetail.hub = model.audit.hub;
        //       // auditDetail.nanny = model.audit.nanny;

        //        // עדכון השאלות והתשובות
        //        foreach (var questionModel in model.questions)
        //        {
        //            var question = auditDetail.Questions.FirstOrDefault(q => q.QuestionId == questionModel.questionId);
        //            if (question != null)
        //            {
        //                question.Answer = questionModel.answer;

        //                // עדכון אפשרויות תשובות אם יש צורך
        //                if (questionModel.answerOptions != null)
        //                {
        //                    foreach (var option in questionModel.answerOptions)
        //                    {
        //                        var answerOption = question.AnswerOptions.FirstOrDefault(o => o.Id == option.id);
        //                        if (answerOption != null)
        //                        {
        //                            answerOption.Option = option.option;
        //                        }
        //                    }
        //                }
        //            }
        //        }

        //        // שמירת השינויים במאגר הנתונים
        //        await _context.SaveChangesAsync();

        //        Console.WriteLine("Audit and questions updated successfully");
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error updating audit: {ex.Message}");
        //        return false;
        //    }
        //}

    }
}
