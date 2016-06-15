/* this function takes the question object returned by the StackOverflow request
and returns new result to be appended to DOM */
​
var showQuestion = function(question) {
​
	// clone our result template code
	var result = $('.templates .question').clone();
​
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);
​
	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());
​
	// set the .viewed for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);
​
	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);
​
	return result;
};
​
​
// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};
​
// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};
​
// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};
	
	$.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET",
	})
	.done(function(tags){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(request.tagged, result.items.length);
​
		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	// error message for request send //
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};
​
​
$(document).ready( function() {
	$('.unanswered-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
​
/* --- TOP ANSWERS FOR TAGS --- */
​
	$('.inspiration-getter').submit( function(e){
		e.preventDefault();
		// empty the results div
		$('.results').html('');
		// assign the value typed in by user to variable
		var tag = $(this).find("input[name='answerers']").val();
		getTopanswers(tag);
	});
});
​
// Takes string that is searched for on StackOverflow
var getTopanswers = function(tag) {
	// StackOverflow API parameters
	var topAnswerRequest = { 
		tagged: tag,
		site: 'stackoverflow',
		period: 'month'
	};
	$.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tag + "/top-answerers/month",
		data: topAnswerRequest,
		dataType: "jsonp",//use jsonp to avoid cross origin issues ... WHY?
		type: "GET",
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		console.log(result.items);
		console.log(result.has_more);
		console.log(result.quota_max);
		console.log(result.quota_remaining);
​
		var searchResults = showSearchResults(topAnswerRequest.tagged, result.items.length);
​
		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var question = showTopanswerer(item.user);
			$('.results').append(question);
		});
	})
	// error message for request send //
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};
​
/* this function takes the question object returned by the StackOverflow request
and returns new result to be appended to DOM */
​
var showTopanswerer = function(answerer) {
​
	// clone our result template code
	var result = $('.templates .question').clone();
​
	// Set the answer properties in result
	var answerElem = result.find('.question-text a');
	answerElem.attr('href', answerer.link);
	answerElem.text(answerer.display_name);
​
	// set the reputation property in result
	var reputationScore = result.find('.asked-date');
	reputationScore.text(answerer.reputation);
​
	// set the .viewed to acceptRate
	var acceptRate = result.find('.viewed');
	acceptRate.text(answerer.accept_rate);
​
	return result;
};
​
​
// 7- showSearchResults & showResults functions