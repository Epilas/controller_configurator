var openHABadr = window.location.hostname+":8025";


$(document).ready(function(){
	
	$("#loginForm").on('submit', function(e) {

		login = $("#login").val();
		password = $("#password").val();
		
		if(!login)	{
			alert("Wprowadź login");
			return false;
		}
		if(!password)	{
			alert("Wpisz hasło");
			return false;
		}
		var request = $.ajax
			({
				url        : "http://"+openHABadr+"/login",
				timeout		:	3000, 
				type       	: 	"POST",
				data       	: 	JSON.stringify({ "u": login, "p": password}),
				contentType : "application/json"
			});
			
			request.done( function(data) 
			{ 
				if(data.status == "success" && data.token)	
					window.location = window.location.origin + '/' + data.token + '/';
				else
					alert("Niepoprawny login lub hasło");
			});
			
			request.fail( function(jqXHR, textStatus ) 
			{ 
				console.log( "Failure: " + textStatus );
			});
			
		});
});
