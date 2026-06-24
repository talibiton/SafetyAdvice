using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using pro.Server.Classes;
using pro.Server.Models;
using ReactApp1.Server.Classes;
using ReactApp1.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Net.Mail;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
//fsbk sarm ybuu lwwt

namespace ReactApp1.Server.Services
{
    public class SaveService
    {

        private readonly SafetyAdviceDB _context;
        private readonly IEmailService _emailService;

        public SaveService(SafetyAdviceDB context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task AddInspectionAsync(SaveData data)
        {

            try
            {
                // חישוב תוקף בהתאם לסוג המבדק
                DateTime validityDate = DateTime.Now;
                if (data.approvalStatus == 1) // רק אם המבדק מאושר
                {
                    switch (data.type)
                    {
                        case 1: // מבדק שנתי
                            validityDate = DateTime.Now.AddYears(1);
                            break;
                        case 2: // פתיחת שנה
                            validityDate = DateTime.Now.AddYears(1);
                            break;
                        case 3: // מילוי מקום - 16 שבועות
                            validityDate = DateTime.Now.AddDays(16 * 7); // 16 שבועות = 112 ימים
                            break;
                        default:
                            validityDate = DateTime.Now;
                            break;
                    }
                }

                var auditDetail = new AuditDetail
                {
                    auditDate = DateTime.Now,
                    counselorId = "234464555",
                    kindergartenCode = data.kinder.code,
                    updateDate = DateTime.Now,
                    type = data.type, // שמירת סוג המבדק
                    validity = validityDate, // תוקף המבדק
                    approvalStatus = data.approvalStatus,

                };

                _context.AuditDetails.Add(auditDetail);
                await _context.SaveChangesAsync();

                foreach (var auditData in data.AuditData)
                {
                    var audit = new Audit
                    {
                        auditId = auditDetail.id,
                        questionId = auditData.questionId,
                        img = auditData.img,
                        answer = auditData.answer,
                        priority = auditData.priority
                    };
                    _context.Audits.Add(audit);
                }
                await _context.SaveChangesAsync();

                foreach (var questionsForSpaceAuditData in data.QuestionsForSpaceAuditData)
                {
                    var questionsForSpaceAudit = new QuestionsForSpaceAudit
                    {
                        auditId = auditDetail.id,
                        questionId = questionsForSpaceAuditData.questionId,
                        img = questionsForSpaceAuditData.img,
                        answer = questionsForSpaceAuditData.answer,
                        priority = questionsForSpaceAuditData.priority
                    };
                    _context.QuestionsForSpaceAudits.Add(questionsForSpaceAudit);
                }

                var pdfBytes = GenerateAuditPdf(data);
                string subject = $"דו\"ח מבדק עבור {data.Nanny.lastName} {data.Nanny.firstName}";
                string body = "מצורף דו\"ח מבדק שבוצע.";

                await _emailService.SendEmailWithPdfAsync(
                    pdfBytes,
                    "talibiton49@gmail.com",
                    subject,
                    body
                );

            }
            catch (Exception ex)
            {

                // רישום לוג מפורט
                Console.WriteLine("Error sending mail: " + ex.Message);
                // החזרת שגיאה עם מידע נוסף או טיפול מתאים
                throw new Exception("Failure sending mail: " + ex.Message);
            }
        }


        public async Task SaveAdressAsync(Adreess newAddress)
        {
            if (newAddress == null)
                throw new ArgumentNullException(nameof(newAddress));

            // Fetch existing address if update is required
            //      var existingAddress = await _context.Kindergartens
            //.Where(a => a.code == newAddress.kinderCode)
            //.OrderByDescending(a => a.seqNr)
            //.FirstOrDefaultAsync();
            var existingAddress = await _context.Kindergartens
                .Where(a => a.code == newAddress.kinderCode)
                .OrderByDescending(a => a.seqNr)
                .Include(a => a.hub)
                .Include(a => a.city)
                //.Include(a => a.nanny) // לוודא שליפת המטפלת
                .FirstOrDefaultAsync();

            if (existingAddress != null)
            {

                var kinnder = new Kindergarten
                {
                    code = existingAddress.code,
                    street = newAddress.street,
                    homeNum = newAddress.homeNum,
                    floor = newAddress.floor,
                    city = existingAddress.city,
                    hubId = existingAddress.hubId,
                    seqNr = existingAddress.seqNr + 1,
                    active = true,
                    nanny = existingAddress.nanny,
                    updateDate = DateTime.Now,
                    organizationsId = existingAddress.organizationsId
                };

                _context.Kindergartens.Add(kinnder);
                await _context.SaveChangesAsync();
            }
            else
            {
                // return BadRequest("kindergaden is not found");
            }

            // Save changes
            await _context.SaveChangesAsync();
        }

        public async Task AddQuestionAsync(Question data)
        {

            try
            {
                var newQuestion = new Question
                {
                    question = data.question,
                    active = true,
                    type = data.type,
                    priority = data.priority,
                    options = data.options
                };

                _context.Questions.Add(newQuestion);

                Console.WriteLine("Adding question...");
                await _context.SaveChangesAsync();
                Console.WriteLine("Question added successfully.");

                var optionsCopy = data.options.ToList();

                if (data.options != null && data.options.Any())
                    foreach (var option in data.options)
                    {
                        var existingOption = await _context.AnswerOptions
                            .FirstOrDefaultAsync(a => a.id == option.id);

                        if (existingOption != null)
                        {
                            existingOption.option = option.option;
                        }
                        else
                        {
                            var newOption = new AnswerOption
                            {
                                questionId = newQuestion.id,
                                option = option.option
                            };
                            _context.AnswerOptions.Add(newOption);
                        }
                    }

                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw;
            }
        }
        public async Task AddQuestionForSpaceAsync(QuestionsForSpace data)
        {

            try
            {
                var newQuestion = new QuestionsForSpace
                {
                    question = data.question,
                    active = true,
                    type = data.type,
                    priority = data.priority,
                    options = data.options
                };

                _context.QuestionsForSpace.Add(newQuestion);
                // await _context.SaveChangesAsync();

                Console.WriteLine("Adding question...");
                await _context.SaveChangesAsync();
                Console.WriteLine("Question added successfully.");

                var optionsCopy = data.options.ToList();

                if (data.options != null && data.options.Any())
                    foreach (var option in data.options)
                    {
                        var existingOption = await _context.AnswerOptionsForSpace
                            .FirstOrDefaultAsync(a => a.id == option.id); // חיפוש לפי ה-ID

                        if (existingOption != null)
                        {
                            // עדכון השדות הקיימים
                            existingOption.option = option.option;
                        }
                        else
                        {
                            // אם הרשומה לא קיימת, יוצרים nueva
                            var newOption = new AnswerOptionsForSpace
                            {
                                questionId = newQuestion.id,
                                option = option.option
                            };
                            _context.AnswerOptionsForSpace.Add(newOption);
                        }
                    }

                // שמירת כל השינויים למסד הנתונים
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw;
            }
        }


        //public byte[] GenerateAuditPdf(SaveData data)
        //{
        //    try
        //    {
        //        // שליפת השאלות והתשובות לפי מזהה
        //        var questionsDict = _context.Questions.ToDictionary(q => q.id, q => q.question);
        //        var spaceQuestionsDict = _context.QuestionsForSpace.ToDictionary(q => q.id, q => q.question);
        //        var answerOptionsDict = _context.AnswerOptions.ToDictionary(a => a.id, a => a.option);
        //        var spaceAnswerOptionsDict = _context.AnswerOptionsForSpace.ToDictionary(a => a.id, a => a.option);

        //        var document = Document.Create(container =>
        //        {
        //            container.Page(page =>
        //            {
        //                page.Margin(30);
        //                page.Content().Column(column =>
        //                {
        //                    column.Item().Text("דו\"ח מבדק").FontSize(20).Bold();
        //                    column.Item().Text($"מטפלת: {data.Nanny.firstName} {data.Nanny.lastName}");
        //                    column.Item().Text($"אישור: {(data.approvalStatus ? "מאושר" : "לא מאושר")}");
        //                    column.Item().Text("תשובות כלליות:");

        //                    foreach (var q in data.AuditData)
        //                    {
        //                        var questionText = questionsDict.TryGetValue(q.questionId, out var qt)
        //                            ? qt
        //                            : $"(שאלה {q.questionId})";

        //                        var answerText = int.TryParse(q.answer, out var aid) && answerOptionsDict.TryGetValue(aid, out var at)
        //                            ? at
        //                            : q.answer;

        //                        column.Item().Text($"שאלה: {questionText}");
        //                        column.Item().Text($"תשובה: {answerText}");
        //                    }

        //                    column.Item().Text("תשובות למרחב:");

        //                    foreach (var q in data.QuestionsForSpaceAuditData)
        //                    {
        //                        var questionText = spaceQuestionsDict.TryGetValue(q.questionId, out var qt)
        //                            ? qt
        //                            : $"(שאלה {q.questionId})";

        //                        var answerText = int.TryParse(q.answer, out var aid) && spaceAnswerOptionsDict.TryGetValue(aid, out var at)
        //                            ? at
        //                            : q.answer;

        //                        column.Item().Text($"שאלה: {questionText}");
        //                        column.Item().Text($"תשובה: {answerText}");
        //                    }
        //                });
        //            });
        //        });

        //        return document.GeneratePdf();
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine("❌ PDF Generation Error: " + ex.Message);
        //        throw;
        //    }
        //}

        //       public byte[] GenerateAuditPdf(SaveData data)
        //       {
        //           try
        //           {
        //               var questionsDict = _context.Questions.ToDictionary(q => q.id, q => q.question);
        //               var spaceQuestionsDict = _context.QuestionsForSpace.ToDictionary(q => q.id, q => q.question);
        //               var answerOptionsDict = _context.AnswerOptions.ToDictionary(a => a.id, a => a.option);
        //               var spaceAnswerOptionsDict = _context.AnswerOptionsForSpace.ToDictionary(a => a.id, a => a.option);

        //               var document = Document.Create(container =>
        //               {
        //                   container.Page(page =>
        //                   {
        //                       page.Margin(30);
        //                       page.Content().Column(column =>
        //                       {
        //                           column.Item().Text("דו\"ח מבדק").FontSize(20).Bold();
        //                           column.Item().Text($"מטפלת: {data.Nanny.firstName} {data.Nanny.lastName}");
        //                           column.Item().Text($"אישור: {(data.approvalStatus ? "מאושר" : "לא מאושר")}");

        //                           // טבלה של תשובות כלליות
        //                           if (data.AuditData.Any())
        //                           {
        //                               column.Item().Element(container =>
        //    container
        //        .PaddingTop(20)
        //        .PaddingBottom(5)
        //        .Text("תשובות כלליות:")
        //        .FontSize(14)
        //        .Bold()
        //); column.Item().Table(table =>
        //                               {
        //                                   table.ColumnsDefinition(columns =>
        //                                   {
        //                                       columns.RelativeColumn(1); // שאלה
        //                                       columns.RelativeColumn(1); // תשובה
        //                                   });

        //                                   // כותרת טבלה
        //                                   table.Header(header =>
        //                                   {
        //                                       header.Cell().Element(CellStyle).Text("שאלה").Bold();
        //                                       header.Cell().Element(CellStyle).Text("תשובה").Bold();
        //                                   });

        //                                   foreach (var q in data.AuditData)
        //                                   {
        //                                       var questionText = questionsDict.TryGetValue(q.questionId, out var qt) ? qt : $"(שאלה {q.questionId})";
        //                                       var answerText = int.TryParse(q.answer, out var aid) && answerOptionsDict.TryGetValue(aid, out var at) ? at : q.answer;

        //                                       table.Cell().Element(CellStyle).Text(questionText);
        //                                       table.Cell().Element(CellStyle).Text(answerText);
        //                                   }
        //                               });
        //                           }

        //                           // טבלה של תשובות למרחב
        //                           if (data.QuestionsForSpaceAuditData.Any())
        //                           {
        //                               column.Item().Element(container =>
        //       container
        //           .PaddingTop(20)
        //           .PaddingBottom(5)
        //           .Text("תשובות למרחב:")
        //           .FontSize(14)
        //           .Bold()
        //   ); column.Item().Table(table =>
        //                               {
        //                                   table.ColumnsDefinition(columns =>
        //                                   {
        //                                       columns.RelativeColumn(1); // שאלה
        //                                       columns.RelativeColumn(1); // תשובה
        //                                   });

        //                                   table.Header(header =>
        //                                   {
        //                                       header.Cell().Element(CellStyle).Text("שאלה").Bold();
        //                                       header.Cell().Element(CellStyle).Text("תשובה").Bold();
        //                                   });

        //                                   foreach (var q in data.QuestionsForSpaceAuditData)
        //                                   {
        //                                       var questionText = spaceQuestionsDict.TryGetValue(q.questionId, out var qt) ? qt : $"(שאלה {q.questionId})";
        //                                       var answerText = int.TryParse(q.answer, out var aid) && spaceAnswerOptionsDict.TryGetValue(aid, out var at) ? at : q.answer;

        //                                       table.Cell().Element(CellStyle).Text(questionText);
        //                                       table.Cell().Element(CellStyle).Text(answerText);
        //                                   }
        //                               });
        //                           }

        //                           // פונקציית עיצוב תא
        //                           IContainer CellStyle(IContainer container) =>
        //                               container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(5);
        //                       });
        //                   });
        //               });

        //               return document.GeneratePdf();
        //           }
        //           catch (Exception ex)
        //           {
        //               Console.WriteLine("❌ PDF Generation Error: " + ex.Message);
        //               throw;
        //           }
        //       }


        public byte[] GenerateAuditPdf(SaveData data)
        {
            try
            {
                var questionsDict = _context.Questions.ToDictionary(q => q.id, q => q.question);
                var spaceQuestionsDict = _context.QuestionsForSpace.ToDictionary(q => q.id, q => q.question);
                var answerOptionsDict = _context.AnswerOptions.ToDictionary(a => a.id, a => a.option);
                var spaceAnswerOptionsDict = _context.AnswerOptionsForSpace.ToDictionary(a => a.id, a => a.option);

                var document = Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Margin(30);

                        page.DefaultTextStyle(TextStyle.Default.DirectionFromRightToLeft()); // הגדרת RTL ברירת מחדל

                        page.Content().Column(column =>
                        {
                            column.Item().AlignRight().Text("דו\"ח מבדק").FontSize(20).Bold();
                            column.Item().AlignRight().Text($"מטפלת: {data.Nanny.firstName} {data.Nanny.lastName}");
                            column.Item().AlignRight().Text($"אישור: {(data.approvalStatus == 1 ? "מאושר" : data.approvalStatus == 2 ? "סגירת משפחתון במיידי" : "לא מאושר")}");

                            if (data.AuditData.Any())
                            {
                                column.Item().Element(container =>
                                    container
                                        .PaddingTop(20)
                                        .PaddingBottom(5)
                                        .Text("תשובות כלליות")
                                        .FontSize(14)
                                        .AlignRight()
                                        .Bold()
                                );

                                column.Item().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.RelativeColumn(1); // שאלה
                                        columns.RelativeColumn(1); // תשובה
                                    });

                                    table.Header(header =>
                                    {
                                        header.Cell().Element(CellStyle).Text("שאלה").Bold().AlignRight();
                                        header.Cell().Element(CellStyle).Text("תשובה").Bold().AlignRight();
                                    });

                                    foreach (var q in data.AuditData)
                                    {
                                        var questionText = questionsDict.TryGetValue(q.questionId, out var qt) ? qt : $"(שאלה {q.questionId})";
                                        var answerText = int.TryParse(q.answer, out var aid) && answerOptionsDict.TryGetValue(aid, out var at) ? at : q.answer;

                                        table.Cell().Element(CellStyle).AlignRight().Text(questionText);
                                        table.Cell().Element(CellStyle).AlignRight().Text(answerText);
                                    }
                                });
                            }

                            if (data.QuestionsForSpaceAuditData.Any())
                            {
                                column.Item().Element(container =>
                                    container
                                        .PaddingTop(20)
                                        .PaddingBottom(5)
                                        .Text("תשובות למרחב")
                                        .AlignRight()
                                        .FontSize(14)
                                        .Bold()
                                );

                                column.Item().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.RelativeColumn(1); // שאלה
                                        columns.RelativeColumn(1); // תשובה
                                    });

                                    table.Header(header =>
                                    {
                                        header.Cell().Element(CellStyle).AlignRight().Text("שאלה").Bold();
                                        header.Cell().Element(CellStyle).AlignRight().Text("תשובה").Bold();
                                    });

                                    foreach (var q in data.QuestionsForSpaceAuditData)
                                    {
                                        var questionText = spaceQuestionsDict.TryGetValue(q.questionId, out var qt) ? qt : $"(שאלה {q.questionId})";
                                        var answerText = int.TryParse(q.answer, out var aid) && spaceAnswerOptionsDict.TryGetValue(aid, out var at) ? at : q.answer;

                                        table.Cell().Element(CellStyle).AlignRight().Text(questionText);
                                        table.Cell().Element(CellStyle).AlignRight().Text(answerText);
                                    }
                                });
                            }

                            // פונקציית עיצוב תא
                            IContainer CellStyle(IContainer container) =>
                                container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(5);
                        });
                    });
                });

                return document.GeneratePdf();
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ PDF Generation Error: " + ex.Message);
                throw;
            }
        }

    }
}

