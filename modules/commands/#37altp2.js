module.exports.config = {
	name: "millionaire",
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "DungUwU",
	description: "Program Who Wants To Be A Millionaire Simple Version",
	commandCategory: "game", 
	usages: "< play/help/bxh >", 
	cooldowns: 3,
  dependencies: {
    "axios":

	}

};

const questionsURL = global.thanhdz.altp_url;

function shuffle(array) {

  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);

    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [

      array[randomIndex], array[currentIndex]];

  }

  return array;

}

function formatQuestion(question) {

	const answersString = [

		"A. " + question.answers['a'],

		"B. " + question.answers['b'],

		"C. " + question.answers['c'],

		"D. " + question.answers['d']

	].join("\n");

	return question.question + "\n" + answersString;

}

const _play_fee = 4000;

const _question_rewards = [

	0,0,0,40,1200,

	1430,1750,2000,2700,5500,

	6300,7900,14000,18000,29000

];



const _timelimit_per_question = 60000;

function calReward(userData, lost) {

	const index = userData.index || 0;

	let reward = null;

	if (lost == true) {

		if (index < 5) reward = 0;

		else if (index < 10) reward = _question_rewards[4];

		else reward = _question_rewards[9];

	} else {

		reward = _question_rewards[index];

	}

	return reward || 0;

}

async function _finishing_game(send, senderID, threadID, Currencies, Users, lost) {

	const userData = {...global._isPlaying_altp.get(senderID)};

	if (!userData.hasOwnProperty("index")) return;

	global._isPlaying_altp.delete(senderID);


	const correctAnswers = lost == true ? userData.index : userData.index + 1;

	const reward = calReward(userData, lost);

	const _help_count = [

		userData.help_1,

		userData.help_2,

		userData.help_3

	].reduce((tol, cur) => tol + (cur == true ? 1 : 0), 0);


	const userName = (await Users.getNameUser(senderID)) || senderID;

	const msg = `Dear player ${userName}, the game is over` +

				`\n• You answered Correctly! ${correctAnswers}/15` +

				`\n• Help used: ${_help_count}/3` +

				`\n• The reward you get: +${reward}$`;

	send(msg, threadID, async (err) => {

		try {

			if (err) throw err;

			await Currencies.increaseMoney(senderID, parseInt(reward));

			const _USER_DATA = (await Users.getData(senderID)).data || {};


			if (!_USER_DATA.hasOwnProperty("altp")) _USER_DATA.altp = { correct: 0, moneyGain: 0 };

			_USER_DATA.altp.correct += correctAnswers;

			_USER_DATA.altp.moneyGain += reward;


			await Users.setData(senderID, { data: _USER_DATA });

		} catch(e) {

			console.error(e);

			send("error lmao...", threadID);

		}

	});

	return;

}


module.exports.onLoad = ({}) => {

	if (!global.hasOwnProperty('_isPlaying_altp')) global._isPlaying_altp = new Map();

	if (!global.hasOwnProperty('_data_altp')) global._data_altp = new Array();

	global.nodemodule["axios"].get(questionsURL)

		.then(res => {

			for (const question of res.data) {

				global._data_altp.push(question);

			}

			("Loaded the command Who Wants to Be a Millionaire");

		})

		.catch(e => {

			console.error(e);

			global._loadFailed_altp = true;

		});

}



module.exports.run = async ({ api, event, args, Users, Currencies }) => {

	const send = api.sendMessage;

	const { threadID, messageID, senderID } = event;

	const query = args[0]?.toLowerCase() || null;

	let _isPaid = false;



	if (global._loadFailed_altp == true || global._data_altp.length == 0) {

		send("This command is currently unavailable, try again in a moment...", threadID);

	} else {

		try {

			switch(query) {

				case "play":

					{

						if (global._isPlaying_altp.has(senderID)) {

							send("You are in your game, can't start another game", threadID);

						} else {

							const userMoney = (await Currencies.getData(senderID)).money || null;

							if (userMoney == null) {

								send("Your account is not in the currency system, please try again later...", threadID);

							} else {

								if (userMoney < _play_fee) {

									send(`Bạn cần ${_play_fee}$ để tham gia...`, threadID);

								} else {

									await Currencies.decreaseMoney(senderID, _play_fee);

									_isPaid = true;



									const questions = shuffle([...global._data_altp]).slice(0, 15);

									const _new_game_data = {

										index: 0,

										help_1: false,

										help_2: false,

										help_3: false,

										questions

									}



									send(`Sentence 1 ( Reward: ${_question_rewards[0]}$ ):\n` + formatQuestion(questions[0]), threadID, async (err, info) => {

										if (err) throw err;

										else {

											_new_game_data.messageID = info.messageID;

											global._isPlaying_altp.set(senderID, {..._new_game_data});

											global.client.handleReply.push({

												name: this.config.name,

												messageID: info.messageID,

												author: senderID

											});



											await new Promise(resolve => setTimeout(resolve, _timelimit_per_question));

											const userData_after = global._isPlaying_altp.get(senderID) || {};



											if (userData_after.messageID == _new_game_data.messageID) {

												_finishing_game(send, senderID, threadID, Currencies, Users, true);

											}

										}

									}, messageID);

								}

							}

						}



						break;

					}

				case "help":

					{

						if (!global._isPlaying_altp.has(senderID)) {

							send("You don't have any games...", threadID);

						} else {

							const userData = global._isPlaying_altp.get(senderID);



							let num = 1;

							const help_1 = userData.help_1 == false ? `\n${num++}. Eliminate 2 wrong answers` : "";

							const help_2 = userData.help_2 == false ? `\n${num++}. Get votes from the audience` : "";

							const help_3 = userData.help_3 == false ? `\n${num++}. Completely changed the question` : "";



							if (num == 1) {

								send("You have no more help left..", threadID, messageID);

							} else {

								send("====== HELP =====" + help_1 + help_2 + help_3 + "\n• Reply to this message with the help number you want to use", threadID, (err, info) => {

									if (err) console.error(err);

									else {

										global.client.handleReply.push({

											name: this.config.name,

											messageID: info.messageID,

											author: senderID,

											type: "help"

										})

									}

								});

							}

						}



						break;

					}

				case "bxh":

					{

						const allUsersDatas = ((await Users.getAll()) || [])

							.filter(e => e.hasOwnProperty("data") && e.data != null)

							.filter(e => e.data.hasOwnProperty("altp"));



						if (allUsersDatas.length == 0) {

							send("No data for statistics yet..", threadID);

						} else {

							const sortedData = allUsersDatas.sort((a, b) => b.data.altp.correct == a.data.altp.correct ? a.name.localeCompare(b.data.name) : b.data.altp.correct - a.data.altp.correct);

							const selfIndex = sortedData.findIndex(e => e.userID == senderID);



							let msg = "==== Rank ====";



							const loopTo = sortedData.length < 10 ? sortedData.length : 10;

							for (let i = 0; i < loopTo; i++) {

								msg += `\n${i + 1}. ${sortedData[i].name} - ${sortedData[i].data.altp.correct} point (${sortedData[i].data.altp.moneyGain}$)`;

							}



							msg += "\n";



							if (selfIndex != -1 && selfIndex > 9) msg += "\nYou are second " + (selfIndex + 1) + " with " + sortedData[selfIndex].data.altp.correct + " point (" + sortedData[selfIndex].data.altp.moneyGain + "$)";

							send(msg, threadID);

						}



						break;

					}

				default:

					{

						send("=== ALTP ===\n- altp play: To join the program\n- altp help: To use help rights\n- altp bxh: To view player rankings", threadID);

						break;

					}

			}

		} catch(e) {

			if (query != "bxh") {

				global._isPlaying_altp.delete(senderID);

				if (_isPaid == true) {

					Currencies.increaseMoney(senderID, _play_fee).catch(e => console.error(e));

				}

				send("An error occurred, refunding...", threadID);

			}

			console.error(e);

		}

	}



	return;

}





function checkAnswer(choice, data) {

	return choice == data.correctAnswer;

}



// Cần thì dùng...

// function getCorrectAnswerString(data) {

// 	return data.correctAnswer.toUpperCase() + '. ' + data.answers[data.correctAnswer];

// }



function get_2_wrong_answers(data) {

	const { correctAnswer } = data;

	const wrongAnswers = shuffle(["a", "b", "c", "d"].filter(e => e != correctAnswer));

	return wrongAnswers.slice(0, 2);

}


function generatePercents() {

	const percents = [];



	let percentLeft = 100;

	for (let i = 0; i < 4; i++) {

		let randPercent = (i == 3 || percentLeft == 0) ? percentLeft : Math.floor(Math.random() * 50);

		while(randPercent > percentLeft) {

			randPercent = Math.floor(Math.random() * 50);

		}



		percentLeft -= randPercent;

		percents.push(randPercent);

	}



	return shuffle(percents);

}



function vote_answers(data) {

	const { correctAnswer } = data;

	const percents = generatePercents();



	if (Math.random() > 0.3) {

		const correctAnswerIndex = ["a", "b", "c", "d"].indexOf(correctAnswer);

		const highestPercentIndex = percents.indexOf(Math.max(...percents));

		const highestPercent = percents[highestPercentIndex];



		const swapToIndex = correctAnswerIndex;

		const swapToValue = percents[swapToIndex];



		percents[swapToIndex] = highestPercent;

		percents[highestPercentIndex] = swapToIndex;

	}



	return percents;

}



module.exports.handleReply = ({ api, event, Currencies, Users, handleReply }) => {

	const send = api.sendMessage;

	const { author } = handleReply;

	const { senderID, threadID, body } = event;

	const choice = body?.toLowerCase() || null;



	if (author == senderID && choice != null) {

		const userData = {...global._isPlaying_altp.get(senderID)};

		if (!userData.hasOwnProperty("index")) return;

		global.client.handleReply.splice(global.client.handleReply.findIndex(e => e.messageID == handleReply.messageID));



		const { questions, index } = userData;



		if (handleReply.type == "help") {

			api.unsendMessage(handleReply.messageID);

			const availableProperty = ["help_1", "help_2", "help_3"].filter(e => userData[e] == false);

			const help_available_count = availableProperty.length;

			if (parseInt(choice) > help_available_count || parseInt(choice) < 1) {

				send("Invalid Selection...", threadID);

			} else {

				const availableProperty = ["help_1", "help_2", "help_3"].filter(e => userData[e] == false);

				const _help_chosen_property = availableProperty[parseInt(choice) - 1];

				userData[_help_chosen_property] = true;

				global._isPlaying_altp.set(senderID, userData);



				if (_help_chosen_property == "help_1") {

					const wrongAnswers = get_2_wrong_answers(questions[index]);

					send("The wrong answer is... " + wrongAnswers.join(", "), threadID);

				} else if (_help_chosen_property == "help_2") {

					const percents = vote_answers(questions[index]);

					send("Voting results:\n" + ["a", "b", "c", "d"].map((e, i) => e.toUpperCase() + ". " + percents[i] + "%").join("\n"), threadID);

				} else {

					const newQuestion = shuffle([...global._data_altp])

											.filter(e => questions.some(ee => ee.question != e.question))[0];



					api.unsendMessage(userData.messageID);

					userData.questions[userData.index] = newQuestion;

					global._isPlaying_altp.set(senderID, userData);



					send(`Sentence ${userData.index + 1} ( Reward: ${_question_rewards[userData.index]}$ ):\n` + formatQuestion(questions[userData.index]), threadID, async (err, info) => {

						try {

							if (err) throw err;

							else {

								userData.messageID = info.messageID;

								global._isPlaying_altp.set(senderID, {...userData});

								global.client.handleReply.push({

									name: this.config.name,

									messageID: info.messageID,

									author: senderID

								});



								await new Promise(resolve => setTimeout(resolve, _timelimit_per_question));

								const userData_after = global._isPlaying_altp.get(senderID) || {};



								if (userData_after.messageID == userData.messageID) {

									_finishing_game(send, senderID, threadID, Currencies, Users, true);

								}

							}

						} catch(e) {

							console.error(e);

						}

					});

				}

			}

		} else {

			const _isCorrect = checkAnswer(choice, questions[index]);



			if (_isCorrect == true) {

				if (userData.index == 14) {

					_finishing_game(send, senderID, threadID, Currencies, Users, false);

				} else {

					send("You answered this question correctly, drop an emotion 👍 to continue or another emotion to stop the game" + `\n• Current reward ${_question_rewards[userData.index]}$`, threadID, async (err, info) => {

						try {

							if (err) throw err;

							else {

								userData.messageID = info.messageID;

								global._isPlaying_altp.set(senderID, {...userData});

								global.client.handleReaction.push({

									name: this.config.name,

									messageID: info.messageID,

									author: senderID

								});



								await new Promise(resolve => setTimeout(resolve, _timelimit_per_question));

								const userData_after = global._isPlaying_altp.get(senderID) || {};



								if (userData_after.messageID == userData.messageID) {

									_finishing_game(send, senderID, threadID, Currencies, Users, false);

								}

							}

						} catch(e) {

							console.error(e);

						}

					});

				}

			} else {

				_finishing_game(send, senderID, threadID, Currencies, Users, true);

			}

		}

	}



	return;

}



module.exports.handleReaction = ({ api, event, Currencies, Users, handleReaction }) => {

	const send = api.sendMessage;

	const { author } = handleReaction;

	const { userID, threadID, reaction } = event;



	const userData = {...global._isPlaying_altp.get(userID)};

	if (!userData.hasOwnProperty("index")) return;



	global.client.handleReaction.splice(global.client.handleReaction.findIndex(e => e.messageID == handleReaction.messageID), 1);

	api.unsendMessage(handleReaction.messageID);



	const { questions } = userData;

	if (reaction == '👍') {

		userData.index++;

		global._isPlaying_altp.set(userID, userData);



		send(`Sentence ${userData.index + 1} ( Reward: ${_question_rewards[userData.index]}$ ):\n` + formatQuestion(questions[userData.index]), threadID, async (err, info) => {

			try {

				if (err) throw err;

				else {

					userData.messageID = info.messageID;

					global._isPlaying_altp.set(userID, {...userData});

					global.client.handleReply.push({

						name: this.config.name,

						messageID: info.messageID,

						author: userID

					});



					await new Promise(resolve => setTimeout(resolve, _timelimit_per_question));

					const userData_after = global._isPlaying_altp.get(userID) || {};



					if (userData_after.messageID == userData.messageID) {

						_finishing_game(send, userID, threadID, Currencies, Users, true);

					}

				}

			} catch(e) {

				console.error(e);

			}

		});

	} else {

		_finishing_game(send, userID, threadID, Currencies, Users, false);

	}



	return;

}