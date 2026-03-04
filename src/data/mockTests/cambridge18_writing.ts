// Cambridge IELTS 18 — Academic Writing
// 2 Tasks · 60 Minutes

export const cambridge18_writing = {
    title: 'Cambridge IELTS 18 – Writing test 1',
    testType: 'Academic Writing',
    totalQuestions: 2, // 2 Tasks
    totalMinutes: 60,
    testId: 'cam18_writing',
    parts: [
        {
            id: 1,
            name: "Part 1",
            instructions: "You should spend about 20 minutes on this task. Write at least 150 words.",
            promptText: [
                {
                    tag: 'p',
                    text: 'The graph below gives information about the percentage of the population in four Asian countries living in cities from 1970 to 2020, with predictions for 2030 and 2040.'
                },
                {
                    tag: 'p',
                    text: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
                }
            ],
            imageUrl: "/cam18_writing_task1.jpg",
            minimumWords: 150
        },
        {
            id: 2,
            name: "Part 2",
            instructions: "You should spend about 40 minutes on this task. Write at least 250 words.",
            promptText: [
                {
                    tag: 'p',
                    text: 'Write about the following topic:'
                },
                {
                    tag: 'blockquote',
                    text: 'In many countries around the world, rural people are moving to cities, so the population in the countryside is decreasing.'
                },
                {
                    tag: 'p',
                    text: 'Do you think this is a positive or a negative development?'
                },
                {
                    tag: 'p',
                    text: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience.'
                }
            ],
            imageUrl: null,
            minimumWords: 250
        }
    ]
};
