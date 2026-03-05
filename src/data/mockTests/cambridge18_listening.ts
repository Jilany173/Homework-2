export const cambridge18_listening = {
    title: 'Cambridge IELTS 18 – Listening test 1',
    testType: 'Listening',
    totalQuestions: 40,
    totalMinutes: 30,
    // Per-part audio files uploaded to: public/audio/
    audioUrl: '/audio/cambridge18_part1.mp3', // Default — overridden per part below
    parts: [

        {
            id: 1,
            name: "Part 1",
            audioUrl: '/audio/cambridge18_part1.mp3',
            instructions: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
            questions: [
                {
                    id: 'survey_1',
                    number: 1,
                    type: 'inline_blanks',
                    instructionGroup: {
                        title: 'Questions 1-10',
                        prompt: 'Complete the notes below.\nWrite <b>ONE WORD AND/OR A NUMBER</b> for each answer.'
                    },
                    content: [
                        { type: 'title', text: 'Transport survey' },
                        { type: 'bullet', text: 'Name: Sadie Jones' },
                        { type: 'bullet', text: 'Year of birth: 1991' },
                        { type: 'bullet', text: 'Postcode: ', inline: { inputId: 'q1', number: 1 } },
                        { type: 'bullet', text: 'Travelling by bus' },
                        { type: 'sub_bullet', text: 'Date of bus journey: ', inline: { inputId: 'q2', number: 2 } },
                        { type: 'sub_bullet', text: 'Reason for trip: shopping and visit to the ', inline: { inputId: 'q3', number: 3 } },
                        { type: 'sub_bullet', text: 'Travelled by bus because cost of ', inline: { inputId: 'q4', number: 4 } },
                        { type: 'text', text: ' too high' },
                        { type: 'sub_bullet', text: 'Got on bus at ', inline: { inputId: 'q5', number: 5 } },
                        { type: 'text', text: ' Street' },
                        { type: 'sub_bullet', text: 'Complaints about bus service:' },
                        { type: 'sub_sub_bullet', text: 'bus today was ', inline: { inputId: 'q6', number: 6 } },
                        { type: 'sub_sub_bullet', text: 'frequency of buses in the ', inline: { inputId: 'q7', number: 7 } },
                        { type: 'bullet', text: 'Travelling by car' },
                        { type: 'sub_bullet', text: 'Goes to the ', inline: { inputId: 'q8', number: 8 } },
                        { type: 'text', text: ' by car' },
                        { type: 'bullet', text: 'Travelling by bicycle' },
                        { type: 'sub_bullet', text: 'Dislikes travelling by bike in the city centre because of the ', inline: { inputId: 'q9', number: 9 } },
                        { type: 'sub_bullet', text: 'Doesn\'t own a bike because of a lack of ', inline: { inputId: 'q10', number: 10 } }
                    ]
                }
            ]
        },
        {
            id: 2, name: "Part 2",
            audioUrl: '/audio/cambridge18_part2.mp3',
            instructions: "Listen and answer questions 11 - 20.", questions: [
                {
                    id: 'q11', number: 11, type: 'multiple_choice',
                    instructionGroup: {
                        title: 'Questions 11-13',
                        prompt: 'Choose the correct letter, <b>A, B</b> or <b>C</b>.'
                    },
                    questionText: "Why does the speaker apologise about the seats?",
                    options: [
                        { label: 'A', text: 'They are too small.' },
                        { label: 'B', text: 'There are not enough of them.' },
                        { label: 'C', text: 'Some of them are very close together.' }
                    ]
                },
                {
                    id: 'q12', number: 12, type: 'multiple_choice',
                    questionText: "What does the speaker say about the age of volunteers?",
                    options: [
                        { label: 'A', text: 'The age of volunteers is less important than other factors.' },
                        { label: 'B', text: 'Young volunteers are less reliable than older ones.' },
                        { label: 'C', text: 'Most volunteers are about 60 years old.' }
                    ]
                },
                {
                    id: 'q13', number: 13, type: 'multiple_choice',
                    questionText: "What does the speaker say about training?",
                    options: [
                        { label: 'A', text: 'It is continuous.' },
                        { label: 'B', text: 'It is conducted by a manager.' },
                        { label: 'C', text: 'It takes place online.' }
                    ]
                },
                {
                    id: 'q14_15', number: 14, type: 'multiple_choice_checkbox',
                    instructionGroup: {
                        title: 'Questions 14 and 15',
                        prompt: 'Choose <b>TWO</b> letters, <b>A-E</b>.'
                    },
                    questionText: "Which TWO issues does the speaker ask the audience to consider before they apply to be volunteers?",
                    maxSelections: 2,
                    options: [
                        { label: 'A', text: 'their financial situation' },
                        { label: 'B', text: 'their level of commitment' },
                        { label: 'C', text: 'their work experience' },
                        { label: 'D', text: 'their ambition' },
                        { label: 'E', text: 'their availability' }
                    ]
                },
                {
                    id: 'q16_20', number: 16, type: 'matching_dropdown',
                    instructionGroup: {
                        title: 'Questions 16-20',
                        prompt: 'What does the speaker suggest would be helpful for each of the following areas of voluntary work?\nChoose the correct letter, <b>A-G</b>, next to Questions 16-20.'
                    },
                    questionText: "",
                    optionsBoxTitle: "Helpful things volunteers might offer",
                    options: [
                        { label: 'A', text: 'experience on stage' },
                        { label: 'B', text: 'original, new ideas' },
                        { label: 'C', text: 'parenting skills' },
                        { label: 'D', text: 'an understanding of food and diet' },
                        { label: 'E', text: 'retail experience' },
                        { label: 'F', text: 'a good memory' },
                        { label: 'G', text: 'a good level of fitness' }
                    ],
                    subQuestions: [
                        { id: 'q16', number: 16, text: 'Fundraising' },
                        { id: 'q17', number: 17, text: 'Litter collection' },
                        { id: 'q18', number: 18, text: "'Playmates'" },
                        { id: 'q19', number: 19, text: 'Story club' },
                        { id: 'q20', number: 20, text: 'First aid' }
                    ]
                }
            ]
        },
        {
            id: 3, name: "Part 3",
            audioUrl: '/audio/cambridge18_part3.mp3',
            instructions: "Listen and answer questions 21 - 30.", questions: [
                {
                    id: 'q21', number: 21, type: 'multiple_choice',
                    instructionGroup: {
                        title: 'Questions 21-26',
                        prompt: '<div class="text-center text-[18px] font-black text-slate-800 mb-4">Talk on jobs in fashion design</div>Choose the correct letter, <b>A, B</b> or <b>C</b>.'
                    },
                    questionText: "What problem did Chantal have at the start of the talk?",
                    options: [
                        { label: 'A', text: 'Her view of the speaker was blocked.' },
                        { label: 'B', text: 'She was unable to find an empty seat.' },
                        { label: 'C', text: 'The students next to her were talking.' }
                    ]
                },
                {
                    id: 'q22', number: 22, type: 'multiple_choice',
                    questionText: "What were Hugo and Chantal surprised to hear about the job market?",
                    options: [
                        { label: 'A', text: 'It has become more competitive than it used to be.' },
                        { label: 'B', text: 'There is more variety in it than they had realised.' },
                        { label: 'C', text: 'Some areas of it are more exciting than others.' }
                    ]
                },
                {
                    id: 'q23', number: 23, type: 'multiple_choice',
                    questionText: "Hugo and Chantal agree that the speaker's message was",
                    options: [
                        { label: 'A', text: 'unfair to them at times.' },
                        { label: 'B', text: 'hard for them to follow.' },
                        { label: 'C', text: 'critical of the industry.' }
                    ]
                },
                {
                    id: 'q24', number: 24, type: 'multiple_choice',
                    questionText: "What do Hugo and Chantal criticise about their school careers advice?",
                    options: [
                        { label: 'A', text: 'when they received the advice' },
                        { label: 'B', text: 'how much advice was given' },
                        { label: 'C', text: 'who gave the advice' }
                    ]
                },
                {
                    id: 'q25', number: 25, type: 'multiple_choice',
                    questionText: "When discussing their future, Hugo and Chantal disagree on",
                    options: [
                        { label: 'A', text: 'which is the best career in fashion.' },
                        { label: 'B', text: 'when to choose a career in fashion.' },
                        { label: 'C', text: 'why they would like a career in fashion.' }
                    ]
                },
                {
                    id: 'q26', number: 26, type: 'multiple_choice',
                    questionText: "How does Hugo feel about being an unpaid assistant?",
                    options: [
                        { label: 'A', text: 'He is realistic about the practice.' },
                        { label: 'B', text: 'He feels the practice is dishonest.' },
                        { label: 'C', text: 'He thinks others want to change the practice.' }
                    ]
                },
                {
                    id: 'q27_28', number: 27, type: 'multiple_choice_checkbox',
                    instructionGroup: {
                        title: 'Questions 27 and 28',
                        prompt: 'Choose <b>TWO</b> letters, <b>A-E</b>.'
                    },
                    questionText: "Which TWO mistakes did the speaker admit she made in her first job?",
                    maxSelections: 2,
                    options: [
                        { label: 'A', text: 'being dishonest to her employer' },
                        { label: 'B', text: 'paying too much attention to how she looked' },
                        { label: 'C', text: 'expecting to become well known' },
                        { label: 'D', text: 'trying to earn a lot of money' },
                        { label: 'E', text: 'openly disliking her client' }
                    ]
                },
                {
                    id: 'q29_30', number: 29, type: 'multiple_choice_checkbox',
                    instructionGroup: {
                        title: 'Questions 29 and 30',
                        prompt: 'Choose <b>TWO</b> letters, <b>A-E</b>.'
                    },
                    questionText: "Which TWO pieces of retail information do Hugo and Chantal agree would be useful?",
                    maxSelections: 2,
                    options: [
                        { label: 'A', text: 'the reasons people return fashion items' },
                        { label: 'B', text: 'how much time people have to shop for clothes' },
                        { label: 'C', text: 'fashion designs people want but can\'t find' },
                        { label: 'D', text: 'the best time of year for fashion buying' },
                        { label: 'E', text: 'the most popular fashion sizes' }
                    ]
                }
            ]
        },
        {
            id: 4, name: "Part 4",
            audioUrl: '/audio/cambridge18_part4.mp3',
            instructions: "Listen and answer questions 31 - 40. Complete the notes below. Write ONE WORD ONLY for each answer.", questions: [
                {
                    id: 'part4_1',
                    number: 31,
                    type: 'inline_blanks',
                    instructionGroup: {
                        title: 'Questions 31-40',
                        prompt: 'Complete the notes below.\nWrite <b>ONE WORD ONLY</b> for each answer.'
                    },
                    content: [
                        { type: 'title', text: 'Elephant translocation' },
                        { type: 'text', text: 'Reasons for overpopulation at Majete National Park' },
                        { type: 'bullet', text: 'strict enforcement of anti-poaching laws' },
                        { type: 'bullet', text: 'successful breeding' },
                        { type: 'text', text: 'Problems caused by elephant overpopulation' },
                        { type: 'bullet', text: 'greater competition, causing hunger for elephants' },
                        { type: 'bullet', text: 'damage to ', inline: { inputId: 'q31', number: 31 } },
                        { type: 'text', text: ' in the park' },
                        { type: 'text', text: 'The translocation process' },
                        { type: 'bullet', text: 'a suitable group of elephants from the same ', inline: { inputId: 'q32', number: 32 } },
                        { type: 'text', text: ' was selected' },
                        { type: 'bullet', text: 'vets and park staff made use of ', inline: { inputId: 'q33', number: 33 } },
                        { type: 'text', text: ' to help guide the elephants into an open plain' },
                        { type: 'bullet', text: 'elephants were immobilised with tranquilisers' },
                        { type: 'sub_bullet', text: 'this process had to be completed quickly to reduce ', inline: { inputId: 'q34', number: 34 } },
                        { type: 'sub_bullet', text: 'elephants had to be turned on their ', inline: { inputId: 'q35', number: 35 } },
                        { type: 'text', text: ' to avoid damage to their lungs' },
                        { type: 'sub_bullet', text: "elephants' ", inline: { inputId: 'q36', number: 36 } },
                        { type: 'text', text: ' had to be monitored constantly' },
                        { type: 'sub_bullet', text: 'tracking devices were fitted to the matriarchs' },
                        { type: 'sub_bullet', text: 'data including the size of their tusks and ', inline: { inputId: 'q37', number: 37 } },
                        { type: 'text', text: ' was taken' },
                        { type: 'bullet', text: 'elephants were taken by truck to their new reserve' },
                        { type: 'text', text: 'Advantages of translocation at Nkhotakota Wildlife Park' },
                        { type: 'bullet', inline: { inputId: 'q38', number: 38 } },
                        { type: 'text', text: ' opportunities' },
                        { type: 'bullet', text: 'a reduction in the number of poachers and ', inline: { inputId: 'q39', number: 39 } },
                        { type: 'bullet', text: 'an example of conservation that other parks can follow' },
                        { type: 'bullet', text: 'an increase in ', inline: { inputId: 'q40', number: 40 } },
                        { type: 'text', text: ' as a contributor to GDP' }
                    ]
                }
            ]
        }
    ]
};
