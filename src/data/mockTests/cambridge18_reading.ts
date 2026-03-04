// Cambridge IELTS 18 — Academic Reading
// 3 Passages · 40 Questions · 60 Minutes

export const cambridge18_reading = {
    title: 'Cambridge IELTS 18 – Reading test 1',
    testType: 'Academic Reading',
    totalQuestions: 40,
    totalMinutes: 60,
    testId: 'cam18_reading',
    passages: [

        // ─── PASSAGE 1 — Q1-13 ────────────────────────────────────────────────
        {
            id: 1,
            name: 'Reading Passage 1',
            title: 'Urban farming',
            questionRange: [1, 13],
            text: [
                {
                    tag: 'p',
                    text: 'In Paris, urban farmers are trying a soil-free approach to agriculture that uses less space and fewer resources. Could it help cities face the threats to our food supplies?',
                },
                {
                    tag: 'p',
                    text: 'On top of a striking new exhibition hall in southern Paris, the world\'s largest urban rooftop farm has started to bear fruit. Strawberries that are small, intensely flavoured and resplendently red sprout abundantly from large plastic tubes. Peer inside and you see the tubes are completely hollow, the roots of dozens of strawberry plants dangling down inside them. From identical vertical tubes nearby burst row upon row of lettuces; near those are aromatic herbs, such as basil, sage and peppermint. Opposite, in narrow, horizontal trays packed not with soil but with coconut fibre, grow cherry tomatoes, shiny aubergines and brightly coloured chards.',
                },
                {
                    tag: 'p',
                    text: 'Pascal Hardy, an engineer and sustainable development consultant, began experimenting with vertical farming and aeroponic growing towers \u2013 as the soil-free plastic tubes are known \u2013 on his Paris apartment block roof five years ago. The urban rooftop space above the exhibition hall is somewhat bigger: 14,000 square metres and almost exactly the size of a couple of football pitches. Already, the team of young urban farmers who tend it have picked, in one day, 3,000 lettuces and 150 punnets of strawberries. When the remaining two thirds of the vast open area are in production, 20 staff will harvest up to 1,000 kg of perhaps 35 different varieties of fruit and vegetables, every day. "We\'re not ever, obviously, going to feed the whole city this way," cautions Hardy. "In the urban environment you\'re working with very significant practical constraints, clearly, on what you can do and where. But if enough unused space can be developed like this, there\'s no reason why you shouldn\'t eventually target maybe between 5% and 10% of consumption."',
                },
                {
                    tag: 'p',
                    text: 'Perhaps most significantly, however, this is a real-life showcase for the work of Hardy\'s flourishing urban agriculture consultancy, Agripolis, which is currently fielding enquiries from around the world to design, build and equip a new breed of soil-free inner-city farm. "The method\'s advantages are many," he says. "First, I don\'t much like the fact that most of the fruit and vegetables we eat have been treated with something like 17 different pesticides, or that the intensive farming techniques that produced them are such huge generators of greenhouse gases. I don\'t much like the fact, either, that they\'ve travelled an average of 2,000 refrigerated kilometres to my plate, that their quality is so poor, because the varieties are selected for their capacity to withstand such substantial journeys, or that 80% of the price I pay goes to wholesalers and transport companies, not the producers."',
                },
                {
                    tag: 'p',
                    text: 'Produce grown using this soil-free method, on the other hand \u2013 which relies solely on a small quantity of water, enriched with organic nutrients, pumped around a closed circuit of pipes, towers and trays \u2013 is "produced up here, and sold locally, just down there. It barely travels at all," Hardy says. "You can select crop varieties for their flavour, not their resistance to the transport and storage chain, and you can pick them when they\'re really at their best, and not before." No soil is exhausted, and the water that gently showers the plants\' roots every 12 minutes is recycled, so the method uses 90% less water than a classic intensive farm for the same yield.',
                },
                {
                    tag: 'p',
                    text: 'Urban farming is not, of course, a new phenomenon. Inner-city agriculture is booming from Shanghai to Detroit and Tokyo to Bangkok. Strawberries are being grown in disused shipping containers, mushrooms in underground carparks. Aeroponic farming, he says, is "virtuous". The equipment weighs little, can be installed on almost any flat surface and is cheap to buy: roughly \u20ac100 to \u20ac150 per square metre. It is cheap to run, too, consuming a tiny fraction of the electricity used by some techniques.',
                },
                {
                    tag: 'p',
                    text: 'Produce grown this way typically sells at prices that, while generally higher than those of classic intensive agriculture, are lower than soil-based organic growers. There are limits to what farmers can grow this way, of course, and much of the produce is suited to the summer months. "Root vegetables we cannot do, at least not yet," he says. "Radishes are OK, but carrots, potatoes, that kind of thing \u2013 the roots are simply too long. Fruit trees are obviously not an option. And beans tend to take up a lot of space for not much return." Nevertheless, urban farming of the kind being practised in Paris is one part of a bigger and fast-changing picture that is bringing food production closer to our lives.',
                },
            ],
            questionGroups: [
                {
                    type: 'notes_completion',
                    instruction: 'Complete the notes below.\n\nChoose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.\n\nWrite your answers in boxes 1\u20133 on your answer sheet.',
                    boxTitle: 'Urban farming in Paris',
                    notes: [
                        {
                            text: 'Vertical tubes are used to grow strawberries,',
                            inline: { inputId: 'q1', number: 1 },
                            suffix: 'and herbs.',
                        },
                        {
                            text: 'There will eventually be a daily harvest of as much as',
                            inline: { inputId: 'q2', number: 2 },
                            suffix: 'in weight of fruit and vegetables.',
                        },
                        {
                            text: "It may be possible that the farm's produce will account for as much as 10% of the city's",
                            inline: { inputId: 'q3', number: 3 },
                            suffix: 'overall.',
                        },
                    ],
                },
                {
                    type: 'table_completion',
                    instruction: 'Complete the table below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes 4\u20137 on your answer sheet.',
                    tableTitle: 'Intensive farming versus aeroponic urban farming',
                    headers: ['', 'Growth', 'Selection', 'Sale'],
                    rows: [
                        {
                            rowHeader: 'Intensive farming',
                            cells: [
                                {
                                    bullets: [
                                        { text: 'wide range of', inline: { inputId: 'q4', number: 4 }, suffix: 'used' },
                                        { text: 'techniques pollute air' },
                                    ],
                                },
                                {
                                    bullets: [
                                        { text: 'quality not good' },
                                        { text: 'varieties of fruit and vegetables chosen that can survive long', inline: { inputId: 'q5', number: 5 } },
                                    ],
                                },
                                {
                                    bullets: [
                                        { inline: { inputId: 'q6', number: 6 }, suffix: 'receive very little of overall income' },
                                    ],
                                },
                            ],
                        },
                        {
                            rowHeader: 'Aeroponic urban farming',
                            cells: [
                                {
                                    bullets: [
                                        { text: 'no soil used' },
                                        { text: 'nutrients added to water, which is recycled' },
                                    ],
                                },
                                {
                                    bullets: [
                                        { text: 'produce chosen because of its', inline: { inputId: 'q7', number: 7 } },
                                    ],
                                },
                                { bullets: [] },
                            ],
                        },
                    ],
                },
                {
                    type: 'true_false_ng',
                    instruction: 'Do the following statements agree with the information given in Reading Passage 1?\n\nIn boxes 8\u201313 on your answer sheet, write\n\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
                    questions: [
                        { id: 'q8', number: 8, statement: 'Urban farming can take place above or below ground.' },
                        { id: 'q9', number: 9, statement: 'Some of the equipment used in aeroponic farming can be made by hand.' },
                        { id: 'q10', number: 10, statement: 'Urban farming relies more on electricity than some other types of farming.' },
                        { id: 'q11', number: 11, statement: 'Fruit and vegetables grown on an aeroponic urban farm are cheaper than traditionally grown organic produce.' },
                        { id: 'q12', number: 12, statement: 'Most produce can be grown on an aeroponic urban farm at any time of the year.' },
                        { id: 'q13', number: 13, statement: 'Beans take longer to grow on an urban farm than other vegetables.' },
                    ],
                },
            ],
        },

        // ─── PASSAGE 2 — Q14-26 ───────────────────────────────────────────────
        {
            id: 2,
            name: 'Reading Passage 2',
            title: 'Forest management in Pennsylvania, USA',
            questionRange: [14, 26],
            text: [
                {
                    tag: 'p',
                    text: 'How managing low-quality wood (also known as low-use wood) for bioenergy can encourage sustainable forest management'
                },
                {
                    tag: 'heading',
                    text: 'A',
                    content: 'A tree\'s \'value\' depends on several factors including its species, size, form, condition, quality, function, and accessibility, and depends on the management goals for a given forest. The same tree can be valued very differently by each person who looks at it. A large, straight black cherry tree has high value as timber to be cut into logs or made into furniture, but for a landowner more interested in wildlife habitat, the real value of that stem (or trunk) may be the food it provides to animals. Likewise, if the tree suffers from black knot disease, its value for timber decreases, but to a woodworker interested in making bowls, it brings an opportunity for a unique and beautiful piece of art.'
                },
                {
                    tag: 'heading',
                    text: 'B',
                    content: 'In the past, Pennsylvania landowners were solely interested in the value of their trees as high-quality timber. The norm was to remove the stems of highest quality and leave behind poorly formed trees that were not as well suited to the site where they grew. This practice, called \'high-grading\', has left a legacy of \'low-use wood\' in the forests. Some people even call these \'junk trees\', and they are abundant in Pennsylvania. These trees have lower economic value for traditional timber markets, compete for growth with higher-value trees, shade out desirable regeneration and decrease the health of a stand* leaving it more vulnerable to poor weather and disease. Management that specifically targets low-use wood can help landowners manage these forest health issues, and wood energy markets help promote this.'
                },
                {
                    tag: 'heading',
                    text: 'C',
                    content: 'Wood energy markets can accept less expensive wood material of lower quality than would be suitable for traditional timber markets. Most wood used for energy in Pennsylvania is used to produce heat or electricity through combustion. Many schools and hospitals use wood boiler systems to heat and power their facilities, many homes are primarily heated with wood, and some coal plants incorporate wood into their coal streams to produce electricity. Wood can also be gasified for electrical generation and can even be made into liquid fuels like ethanol and gasoline for lorries and cars. All these products are made primarily from low-use wood. Several tree- and plant-cutting approaches, which could greatly improve the long-term quality of a forest, focus strongly or solely on the use of wood for those markets.'
                },
                {
                    tag: 'heading',
                    text: 'D',
                    content: 'One such approach is called a Timber Stand Improvement (TSI) Cut. In a TSI Cut, really poor-quality tree and plant material is cut down to allow more space, light, and other resources to the highest-valued stems that remain. Removing invasive plants might be another primary goal of a TSI Cut. The stems that are left behind might then grow in size and develop more foliage and larger crowns or tops that produce more coverage for wildlife; they have a better chance to regenerate in a less crowded environment. TSI Cuts can be tailored to one farmer\'s specific management goals for his or her land.'
                },
                {
                    tag: 'heading',
                    text: 'E',
                    content: 'Another approach that might yield a high amount of low-use wood is a Salvage Cut. With the many pests and pathogens visiting forests including hemlock wooly adelgid, Asian longhorned beetle, emerald ash borer, and gypsy moth, to name just a few, it is important to remember that those working in the forests can help ease these issues through cutting procedures. These types of cut reduce the number of sick trees and seek to manage the future spread of a pest problem. They leave vigorous trees that have stayed healthy enough to survive the outbreak.'
                },
                {
                    tag: 'heading',
                    text: 'F',
                    content: 'A Shelterwood Cut, which only takes place in a mature forest that has already been thinned several times, involves removing all the mature trees when other seedlings have become established. This then allows the forester to decide which tree species are regenerated. It leaves a young forest where all trees are at a similar point in their growth. It can also be used to develop a two-tier forest so that there are two harvests and the money that comes in is spread out over a decade or more.'
                },
                {
                    tag: 'heading',
                    text: 'G',
                    content: 'Thinnings and dense and dead wood removal for fire prevention also center on the production of low-use wood. However, it is important to remember that some retention of what many would classify as low-use wood is very important. The tops of trees that have been cut down should be left on the site so that their nutrients cycle back into the soil. In addition, trees with many cavities are extremely important habitats for insect predators like woodpeckers, bats and small mammals. They help control problem insects and increase the health and resilience of the forest. It is also important to remember that not all small trees are low-use. For example, many species like hawthorn provide food for wildlife. Finally, rare species of trees in a forest should also stay behind as they add to its structural diversity.'
                },
                {
                    tag: 'p',
                    text: 'Glossary\n* Stand: An area covered with trees that have common features (e.g. size)'
                }
            ],
            questionGroups: [
                {
                    type: 'matching_features',
                    instruction: 'Reading Passage 2 has seven paragraphs, A–G.\n\nWhich paragraph contains the following information?\n\nChoose the correct letter, A–G, in boxes 14–18 on your answer sheet.\n\nNB You may use any letter more than once.',
                    features: [
                        { label: 'A', text: 'Paragraph A' },
                        { label: 'B', text: 'Paragraph B' },
                        { label: 'C', text: 'Paragraph C' },
                        { label: 'D', text: 'Paragraph D' },
                        { label: 'E', text: 'Paragraph E' },
                        { label: 'F', text: 'Paragraph F' },
                        { label: 'G', text: 'Paragraph G' },
                    ],
                    questions: [
                        { id: 'q14', number: 14, description: 'bad outcomes for a forest when people focus only on its financial reward' },
                        { id: 'q15', number: 15, description: 'reference to the aspects of any tree that contribute to its worth' },
                        { id: 'q16', number: 16, description: 'mention of the potential use of wood to help run vehicles' },
                        { id: 'q17', number: 17, description: 'examples of insects that attack trees' },
                        { id: 'q18', number: 18, description: 'an alternative name for trees that produce low-use wood' },
                    ],
                },
                {
                    type: 'matching_features',
                    instruction: 'Look at the following purposes (Questions 19–21) and the list of timber cuts below.\n\nMatch each purpose with the correct timber cut, A–C.\n\nChoose the correct letter, A–C, next to Questions 19–21.\n\nNB You may use any letter more than once.',
                    features: [
                        { label: 'A', text: 'a TSI Cut' },
                        { label: 'B', text: 'a Salvage Cut' },
                        { label: 'C', text: 'a Shelterwood Cut' },
                    ],
                    questions: [
                        { id: 'q19', number: 19, description: 'to remove trees that are diseased' },
                        { id: 'q20', number: 20, description: 'to generate income across a number of years' },
                        { id: 'q21', number: 21, description: 'to create a forest whose trees are close in age' },
                    ],
                },
                {
                    type: 'notes_completion',
                    instruction: 'Complete the sentences below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes 22–26 on your answer sheet.',
                    notes: [
                        {
                            text: 'Some dead wood is removed to avoid the possibility of',
                            inline: { inputId: 'q22', number: 22 },
                            suffix: '.',
                        },
                        {
                            text: 'The',
                            inline: { inputId: 'q23', number: 23 },
                            suffix: 'from the tops of cut trees can help improve soil quality.',
                        },
                        {
                            text: 'Some damaged trees should be left, as their',
                            inline: { inputId: 'q24', number: 24 },
                            suffix: 'provide habitats for a range of creatures.',
                        },
                        {
                            text: 'Some trees that are small, such as',
                            inline: { inputId: 'q25', number: 25 },
                            suffix: ', are a source of food for animals and insects.',
                        },
                        {
                            text: 'Any trees that are',
                            inline: { inputId: 'q26', number: 26 },
                            suffix: 'should be left to grow, as they add to the variety of species in the forest.',
                        },
                    ],
                },
            ],
        },

        // ─── PASSAGE 3 — Q27-40 ───────────────────────────────────────────────
        {
            id: 3,
            name: 'Reading Passage 3',
            title: 'Conquering Earth\'s space junk problem',
            questionRange: [27, 40],
            text: [
                {
                    tag: 'p',
                    text: 'Satellites, rocket shards and collision debris are creating major traffic risks in orbit around the planet. Researchers are working to reduce these threats'
                },
                {
                    tag: 'heading',
                    text: 'A',
                    content: 'Last year, commercial companies, military and civil departments and amateurs sent more than 400 satellites into orbit, over four times the yearly average in the previous decade. Numbers could rise even more sharply if leading space companies follow through on plans to deploy hundreds to thousands of large constellations of satellites to space in the next few years.\n\nAll that traffic can lead to disaster. Ten years ago, a US commercial Iridium satellite smashed into an inactive Russian communications satellite called Cosmos-2251, creating thousands of new pieces of space shrapnel that now threaten other satellites in low Earth orbit - the zone stretching up to 2,000 kilometres in altitude. Altogether, there are roughly 20,000 human-made objects in orbit, from working satellites to small rocket pieces. And satellite operators can\'t steer away from every potential crash, because each move consumes time and fuel that could otherwise be used for the spacecraft\'s main job.'
                },
                {
                    tag: 'heading',
                    text: 'B',
                    content: 'Concern about space junk goes back to the beginning of the satellite era, but the number of objects in orbit is rising so rapidly that researchers are investigating new ways of attacking the problem. Several teams are trying to improve methods for assessing what is in orbit, so that satellite operators can work more efficiently in ever-more-crowded space. Some researchers are now starting to compile a massive data set that includes the best possible information on where everything is in orbit. Others are developing taxonomies of space debris - working on measuring properties such as the shape and size of an object, so that satellite operators know how much to worry about what\'s coming their way.\n\nThe alternative, many say, is unthinkable. Just a few uncontrolled space crashes could generate enough debris to set off a runaway cascade of fragments, rendering near-Earth space unusable. "If we go on like this, we will reach a point of no return," says Carolin Frueh, an astrodynamical researcher at Purdue University in West Lafayette, Indiana.'
                },
                {
                    tag: 'heading',
                    text: 'C',
                    content: 'Even as our ability to monitor space objects increases, so too does the total number of items in orbit. That means companies, governments and other players in space are collaborating in new ways to avoid a shared threat. International groups such as the Inter-Agency Space Debris Coordination Committee have developed guidelines on space sustainability. Those include inactivating satellites at the end of their useful life by venting pressurised materials or leftover fuel that might lead to explosions. The intergovernmental groups also advise lowering satellites deep enough into the atmosphere that they will burn up or disintegrate within 25 years. But so far, only about half of all missions have abided by this 25-year goal, says Holger Krag, head of the European Space Agency\'s space-debris office in Darmstadt, Germany. Operators of the planned large constellations of satellites say they will be responsible stewards in their enterprises in space, but Krag worries that problems could increase, despite their best intentions. "What happens to those that fail or go bankrupt?" he asks. "They are probably not going to spend money to remove their satellites from space."'
                },
                {
                    tag: 'heading',
                    text: 'D',
                    content: 'In theory, given the vastness of space, satellite operators should have plenty of room for all these missions to fly safely without ever nearing another object. So some scientists are tackling the problem of space junk by trying to find out where all the debris is to a high degree of precision. That would alleviate the need for many of the unnecessary manoeuvres that are carried out to avoid potential collisions. "If you knew precisely where everything was, you would almost never have a problem," says Marlon Sorge, a space-debris specialist at the Aerospace Corporation in El Segundo, California.'
                },
                {
                    tag: 'heading',
                    text: 'E',
                    content: 'The field is called space traffic management, because it\'s similar to managing traffic on the roads or in the air. Think about a busy day at an airport, says Moriba Jah, an astrodynamicist at the University of Texas at Austin: planes line up in the sky, landing and taking off close to one another in a carefully choreographed routine. Air-traffic controllers know the location of the planes down to one metre in accuracy. The same can\'t be said for space debris. Not all objects in orbit are known, and even those included in databases are not tracked consistently.'
                },
                {
                    tag: 'heading',
                    text: 'F',
                    content: 'An additional problem is that there is no authoritative catalogue that accurately lists the orbits of all known space debris. Jah illustrates this with a web-based database that he has developed. It draws on several sources, such as catalogues maintained by the US and Russian governments, to visualise where objects are in space. When he types in an identifier for a particular space object, the database draws a purple line to designate its orbit. Only this doesn\'t quite work for a number of objects, such as a Russian rocket body designated in the database as object number 32280. When Jah enters that number, the database draws two purple lines: the US and Russian sources contain two completely different orbits for the same object. Jah says that it is almost impossible to tell which is correct, unless a third source of information made it possible to cross-correlate.\n\nJah describes himself as a space environmentalist: "I want to make space a place that is safe to operate, that is free and useful for generations to come." Until that happens, he argues, the space community will continue devolving into a tragedy in which all spaceflight operators are polluting a common resource.'
                }
            ],
            questionGroups: [
                {
                    type: 'matching_features',
                    instruction: 'Reading Passage 3 has six sections, A–F.\n\nWhich section contains the following information?\n\nChoose the correct letter, A–F, in boxes 27–31 on your answer sheet.',
                    features: [
                        { label: 'A', text: 'Section A' },
                        { label: 'B', text: 'Section B' },
                        { label: 'C', text: 'Section C' },
                        { label: 'D', text: 'Section D' },
                        { label: 'E', text: 'Section E' },
                        { label: 'F', text: 'Section F' },
                    ],
                    questions: [
                        { id: 'q27', number: 27, description: 'a reference to the cooperation that takes place to try and minimise risk' },
                        { id: 'q28', number: 28, description: 'an explanation of a person\'s aims' },
                        { id: 'q29', number: 29, description: 'a description of a major collision that occurred in space' },
                        { id: 'q30', number: 30, description: 'a comparison between tracking objects in space and the efficiency of a transportation system' },
                        { id: 'q31', number: 31, description: 'a reference to efforts to classify space junk' },
                    ],
                },
                {
                    type: 'notes_completion',
                    instruction: 'Complete the summary below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes 32–35 on your answer sheet.',
                    boxTitle: 'The Inter-Agency Space Debris Coordination Committee',
                    notes: [
                        {
                            text: 'The committee gives advice on how the',
                            inline: { inputId: 'q32', number: 32 },
                            suffix: 'of space can be achieved. The committee advises that when satellites are no longer active, any unused',
                        },
                        {
                            inline: { inputId: 'q33', number: 33 },
                            suffix: 'or pressurised material that could cause',
                        },
                        {
                            inline: { inputId: 'q34', number: 34 },
                            suffix: 'should be removed.',
                        },
                        {
                            text: 'Although operators of large satellite constellations accept that they have obligations as stewards of space, Holger Krag points out that the operators that become',
                            inline: { inputId: 'q35', number: 35 },
                            suffix: 'are unlikely to prioritise removing their satellites from space.',
                        },
                    ],
                },
                {
                    type: 'matching_features',
                    instruction: 'Look at the following statements (Questions 36–40) and the list of people below.\n\nMatch each statement with the correct person, A–D.\n\nChoose the correct letter, A–D, next to Questions 36–40.\n\nNB You may use any letter more than once.',
                    features: [
                        { label: 'A', text: 'Carolin Frueh' },
                        { label: 'B', text: 'Holger Krag' },
                        { label: 'C', text: 'Marlon Sorge' },
                        { label: 'D', text: 'Moriba Jah' },
                    ],
                    questions: [
                        { id: 'q36', number: 36, description: 'Knowing the exact location of space junk would help prevent any possible danger.' },
                        { id: 'q37', number: 37, description: 'Space should be available to everyone and should be preserved for the future.' },
                        { id: 'q38', number: 38, description: 'A recommendation regarding satellites is widely ignored.' },
                        { id: 'q39', number: 39, description: 'There is conflicting information about where some satellites are in space.' },
                        { id: 'q40', number: 40, description: 'There is a risk we will not be able to undo the damage that occurs in space.' },
                    ],
                },
            ],
        },
    ]
};
