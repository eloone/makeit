Template['output'].message = function () {
	var reward = Session.get('reward'),
		message = '';

	switch(reward){
		case 'goal_complete':
			message = 'Goal completed, you made it ! KaBoomBastic !';
			break;
		case 'goal_complete_challenge_blast':
			message = 'Because you have competed your goal with a challenge and a blast, the world has stopped spinning for you. Bravo !';
			break;
		case 'goal_complete_challenge' :
			message = 'You completed your goal with a challenge, you rock !';
			break;
		case 'goal_complete_blast':
			message = 'You completed your goal with a blast, fantastic !';
			break;
		case 'challenge_blast':
			message = 'Challenge and blast done and done ! KaBoom ! KaBoom !';
			break;
		case 'challenge':
			message = 'Challenge completed ! KaBoomYeah !';
			break;
		case 'blast' :
			message = 'What a blast ! more, more, more !';
			break;
		case 'done': 
			message = 'Keep up the good work !'
			break;
		default :
			message = 'I exist to help you achieve your dreams. Come on let\'s do this !';
			break;
	}

	return message;
};