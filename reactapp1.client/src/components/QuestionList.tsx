import { useEffect, useState } from 'react'
import Question from './Question';
import { get } from '../libs/rest-service';

const QuestionList = (props: any) => {
    const { isSubmitting } = props;
    const [questionList, setQuestionList] = useState([]);
    const [answerList, setAnswerList] = useState([] as any[]);
   
    const [questionsForSpace, setquestionsForSpace] = useState([]);
    const [answerForSpace, setAnswerForSpace] = useState([] as any[]);

    const [spaceRepeats, setSpaceRepeats] = useState(1); // כמה פעמים להציג את השאלות פר חלל

    useEffect(() => {
        get("/question/GetActiveQuestions")
            .then((data) => setQuestionList(data));
    }, []);

    useEffect(() => {
        get("/questionsForSpace/GetActiveQuestionsForSpace")
            .then((data) => setquestionsForSpace(data));
    }, [])
    
    const handleAnswerChange = (e: any) => {
        const allAnswer1 = answerList.filter((a: any) => a.questionId !== e.questionId);
        const list = [...allAnswer1, e];
        setAnswerList(list);
        props.handleAnswerChange(list);

    };
    const handleAnswerForSpaceChange = (e: any) => {
        const allAnswer2 = answerForSpace.filter((a: any) => !(a.questionId === e.questionId && a.spaceIndex === e.spaceIndex));
        const lst = [...allAnswer2, e];
        setAnswerForSpace(lst);
        props.handleAnswerForSpaceChange(lst);

    };

    const addSpaceSection = () => {
        setSpaceRepeats(prev => prev + 1); // מוסיף עוד עותק של שאלות פר חלל
    }

    return (
        <div>
            {questionList?.map((question: any, index: any) =>
                <Question
                    key={`q-${index}`}
                    quest={question}
                    handleAnswerChange={handleAnswerChange}
                    isForSpace={false}
                    isSubmitting={isSubmitting}
                />
            )}

            {Array.from({ length: spaceRepeats }).map((_, repeatIndex) =>
                questionsForSpace?.map((question_space: any, index_space: any) =>
                    <Question
                        key={`space-${repeatIndex}-${index_space}`}
                        quest={{ ...question_space, spaceIndex: repeatIndex }}
                        handleAnswerChange={handleAnswerForSpaceChange}
                        isForSpace={true}
                        isSubmitting={isSubmitting}
                    />
                )
            )}

            <button type="button" onClick={addSpaceSection} disabled={isSubmitting}>הוסף חלל נוסף</button>
        </div>
    );
};

export default QuestionList;
