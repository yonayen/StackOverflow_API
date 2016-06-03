$(document).ready(function() {
	$('.unanswered-getter').submit(function(e){
		// prevents page from being reloaded when submitting entry in form
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		// calls getUnanswered function
		getUnanswered(tags);

	});
});