export const cambridge18_listening_test2 = {
    title: 'Cambridge IELTS 18 – Listening test 2',
    testType: 'Listening',
    totalQuestions: 40,
    totalMinutes: 30,
    audioUrl: '/audio/cam18_test2_part1.mp3',
    parts: [
        {
            id: 1,
            name: "Part 1",
            audioUrl: '/audio/cam18_test2_part1.mp3',
            instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
            questions: [
                {
                    id: 'part1_1',
                    number: 1,
                    type: 'inline_blanks',
                    instructionGroup: {
                        title: 'Questions 1-5',
                        prompt: 'Complete the notes below.\nWrite <b>ONE WORD ONLY</b> for each answer.'
                    },
                    content: [], // Backward compatibility
                    simpleContent: [
                        "### Working at Milo's Restaurants",
                        "* Benefits",
                        "  * [q1, 1] provided for all staff",
                        "  * [q2, 2] during weekdays at all Milo's Restaurants",
                        "  * [q3, 3] provided after midnight",
                        "* Person specification",
                        "  * must be prepared to work well in a team",
                        "  * must care about maintaining a high standard of [q4, 4]",
                        "  * must have a qualification in [q5, 5]"
                    ]
                },
                {
                    id: 'part1_2',
                    number: 6,
                    type: 'fill_in_table',
                    instructionGroup: {
                        title: 'Questions 6-10',
                        prompt: 'Complete the table below.\nWrite <b>ONE WORD AND/OR A NUMBER</b> for each answer.'
                    },
                    headers: ['Location', 'Job title', 'Responsibilities include', 'Pay and conditions'],
                    simpleRows: [
                        [
                            '[q6, 6] Street',
                            'Breakfast supervisor',
                            '* Checking portions, etc. are correct\n* Making sure [q7, 7] is clean',
                            '* Starting salary £ [q8, 8] per hour\n* Start work at 5.30 a.m.'
                        ],
                        [
                            'City Road',
                            'Junior chef',
                            '* Supporting senior chefs\n* Maintaining stock and organising [q9, 9]',
                            '* Annual salary £23,000\n* No work on a [q10, 10] once a month'
                        ]
                    ]
                }
            ]
        },
        {
            id: 2, name: "Part 2", audioUrl: '/audio/cam18_test2_part2.mp3', instructions: "Listen and answer questions 11 - 20.", questions: [
                {
                    id: 'q11_12', number: 11, type: 'multiple_choice_checkbox',
                    instructionGroup: {
                        title: 'Questions 11 and 12',
                        prompt: 'Choose <b>TWO</b> letters, <b>A-E</b>.'
                    },
                    questionText: "What are the TWO main reasons why this site has been chosen for the housing development?",
                    maxSelections: 2,
                    options: [
                        { label: 'A', text: 'It has suitable geographical features.' },
                        { label: 'B', text: 'There is easy access to local facilities.' },
                        { label: 'C', text: 'It has good connections with the airport.' },
                        { label: 'D', text: 'The land is of little agricultural value.' },
                        { label: 'E', text: 'It will be convenient for workers.' }
                    ]
                },
                {
                    id: 'q13_14', number: 13, type: 'multiple_choice_checkbox',
                    instructionGroup: {
                        title: 'Questions 13 and 14',
                        prompt: 'Choose <b>TWO</b> letters, <b>A-E</b>.'
                    },
                    questionText: "Which TWO aspects of the planned housing development have people given positive feedback about?",
                    maxSelections: 2,
                    options: [
                        { label: 'A', text: 'the facilities for cyclists' },
                        { label: 'B', text: 'the impact on the environment' },
                        { label: 'C', text: 'the encouragement of good relations between residents' },
                        { label: 'D', text: 'the low cost of all the accommodation' },
                        { label: 'E', text: 'the rural location' }
                    ]
                },
                {
                    id: 'q15_20', number: 15, type: 'matching_table',
                    instructionGroup: {
                        title: 'Questions 15-20',
                        prompt: 'Label the map below.\nChoose the correct letter, <b>A-I</b>, next to Questions 15-20.'
                    },
                    questionText: "",
                    optionsBoxTitle: "",
                    imageUrl: '/images/cam18_test2_map.png',
                    options: [
                        { label: 'A', text: 'A' },
                        { label: 'B', text: 'B' },
                        { label: 'C', text: 'C' },
                        { label: 'D', text: 'D' },
                        { label: 'E', text: 'E' },
                        { label: 'F', text: 'F' },
                        { label: 'G', text: 'G' },
                        { label: 'H', text: 'H' },
                        { label: 'I', text: 'I' }
                    ],
                    subQuestions: [
                        { id: 'q15', number: 15, text: 'School' },
                        { id: 'q16', number: 16, text: 'Sports centre' },
                        { id: 'q17', number: 17, text: 'Clinic' },
                        { id: 'q18', number: 18, text: 'Community centre' },
                        { id: 'q19', number: 19, text: 'Supermarket' },
                        { id: 'q20', number: 20, text: 'Playground' }
                    ]
                }
            ]
        },
        {
            id: 3, name: "Part 3", audioUrl: '/audio/cam18_test2_part3.mp3', instructions: "Listen and answer questions 21 - 30.", questions: [
                {
                    id: 'q21', number: 21, type: 'multiple_choice',
                    instructionGroup: {
                        title: 'Questions 21-24',
                        prompt: 'Choose the correct letter, <b>A, B</b> or <b>C</b>.'
                    },
                    questionText: "Why do the students think the Laki eruption of 1783 is so important?",
                    options: [
                        { label: 'A', text: 'It was the most severe eruption in modern times.' },
                        { label: 'B', text: 'It led to the formal study of volcanoes.' },
                        { label: 'C', text: 'It had a profound effect on society.' }
                    ]
                },
                {
                    id: 'q22', number: 22, type: 'multiple_choice',
                    questionText: "What surprised Adam about observations made at the time?",
                    options: [
                        { label: 'A', text: 'the number of places producing them' },
                        { label: 'B', text: 'the contradictions in them' },
                        { label: 'C', text: 'the lack of scientific data to support them' }
                    ]
                },
                {
                    id: 'q23', number: 23, type: 'multiple_choice',
                    questionText: "According to Michelle, what did the contemporary sources say about the Laki haze?",
                    options: [
                        { label: 'A', text: 'People thought it was similar to ordinary fog.' },
                        { label: 'B', text: 'It was associated with health issues.' },
                        { label: 'C', text: 'It completely blocked out the sun for weeks.' }
                    ]
                },
                {
                    id: 'q24', number: 24, type: 'multiple_choice',
                    questionText: "Adam corrects Michelle when she claims that Benjamin Franklin",
                    options: [
                        { label: 'A', text: 'came to the wrong conclusion about the cause of the haze.' },
                        { label: 'B', text: 'was the first to identify the reason for the haze.' },
                        { label: 'C', text: 'supported the opinions of other observers about the haze.' }
                    ]
                },
                {
                    id: 'q27_30', number: 27, type: 'matching_drag_drop',
                    instructionGroup: {
                        title: 'Questions 27-30',
                        prompt: 'What comment do the students make about the impact of the Laki eruption on the following countries?\nChoose the correct answer and move it into the gap.'
                    },
                    questionText: "",
                    optionsBoxTitle: "Comments",
                    options: [
                        { label: 'A', text: 'This country suffered the most severe loss of life' },
                        { label: 'B', text: 'The impact on agriculture was predictable.' },
                        { label: 'C', text: 'There was a significant increase in deaths of young people.' },
                        { label: 'D', text: 'Animals suffered from a sickness.' },
                        { label: 'E', text: 'This country saw the highest rise in food prices in the world.' },
                        { label: 'F', text: 'It caused a particularly harsh winter.' }
                    ],
                    subQuestions: [
                        { id: 'q27', number: 27, text: 'Iceland' },
                        { id: 'q28', number: 28, text: 'Egypt' },
                        { id: 'q29', number: 29, text: 'UK' },
                        { id: 'q30', number: 30, text: 'USA' }
                    ]
                }
            ]
        },
        {
            id: 4, name: "Part 4", audioUrl: '/audio/cam18_test2_part4.mp3', instructions: "Listen and answer questions 31 - 40.", questions: [
                {
                    id: 'q31_40', number: 31, type: 'inline_blanks',
                    instructionGroup: {
                        title: 'Questions 31-40',
                        prompt: 'Complete the notes below.\nWrite <b>ONE WORD ONLY</b> for each answer.'
                    },
                    content: [
                        { type: 'title', text: 'Pockets' },

                        { type: 'text', text: 'Reason for choice of subject', className: 'font-bold mt-4' },
                        { type: 'bullet', text: 'They are ' },
                        { type: 'inline', inline: { inputId: 'q31', number: 31 } },
                        { type: 'text', text: ' but can be overlooked by consumers and designers.' },

                        { type: 'text', text: "Pockets in men's clothes", className: 'font-bold mt-6' },
                        { type: 'bullet', text: 'Men started to wear ' },
                        { type: 'inline', inline: { inputId: 'q32', number: 32 } },
                        { type: 'text', text: ' in the 18th century.' },

                        { type: 'bullet', text: 'A ' },
                        { type: 'inline', inline: { inputId: 'q33', number: 33 } },
                        { type: 'text', text: ' sewed pockets into the lining of the garments.' },

                        { type: 'bullet', text: 'The wearer could use the pockets for small items.' },

                        { type: 'bullet', text: 'Bigger pockets might be made for men who belonged to a certain type of ' },
                        { type: 'inline', inline: { inputId: 'q34', number: 34 } },
                        { type: 'text', text: '.' },

                        { type: 'text', text: "Pockets in women's clothes", className: 'font-bold mt-6' },
                        { type: 'bullet', text: "Women's pockets were less " },
                        { type: 'inline', inline: { inputId: 'q35', number: 35 } },
                        { type: 'text', text: " than men's." },

                        { type: 'bullet', text: 'Women were very concerned about pickpockets.' },

                        { type: 'bullet', text: 'Pockets were produced in pairs using ' },
                        { type: 'inline', inline: { inputId: 'q36', number: 36 } },
                        { type: 'text', text: ' to link them together.' },

                        { type: 'bullet', text: "Pockets hung from the women's " },
                        { type: 'inline', inline: { inputId: 'q37', number: 37 } },
                        { type: 'text', text: ' under skirts and petticoats.' },

                        { type: 'bullet', text: 'Items such as ' },
                        { type: 'inline', inline: { inputId: 'q38', number: 38 } },
                        { type: 'text', text: ' could be reached through a gap in the material.' },

                        { type: 'bullet', text: 'Pockets, of various sizes, stayed inside clothing for many decades.' },

                        { type: 'bullet', text: 'When dresses changed shape, hidden pockets had a negative effect on the ' },
                        { type: 'inline', inline: { inputId: 'q39', number: 39 } },
                        { type: 'text', text: ' of women.' },

                        { type: 'bullet', text: "Bags called 'pouches' became popular, before women carried a " },
                        { type: 'inline', inline: { inputId: 'q40', number: 40 } },
                        { type: 'text', text: '.' }
                    ]
                }
            ]
        }
    ]
};
