	
	var address = "ws://"+window.location.hostname+":1880/ws";

	function init()
	{
		webSocket();
	}

	function webSocket()
	{		
		websocket = new WebSocket(address);
		websocket.onopen = function(evt) { onOpen(evt) };
		websocket.onclose = function(evt) { onClose(evt) };
		websocket.onmessage = function(evt) { onMessage(evt) };
		websocket.onerror = function(evt) { onError(evt) };
		$("#netIP").text(window.location.hostname);
	}

	function onOpen(evt)
	{
		$("#netStatus")
		.text("Połączono")
		.css({'color':'green'});
		console.log("CONNECTED");
		// Wyświetl status połączenia
	}

	function reconnect()	{
		$("#netStatus")
		.text("Próba połączenia")
		.css({'color':'orange'});
		console.log("CONNECTION ATTEMPT WITHIN 3 SEC");
		setTimeout(function() { init(); }, 2000);
	}
	
	function onClose(evt)
	{
		$("#netStatus")
		.text("Rozłączono")
		.css({'color':'red'});
		console.log("DISCONNECTED");
		setTimeout(function(){reconnect();},1500);
	}
	
	function onMessage(evt)
	{
		input = JSON.parse(evt.data);
	}
			
	function onError(evt)
	{
		console.log('ERROR: '+evt.data);
	}

	function doSend(reg,value)
	{	
      //  toSend[0] = Number(reg)
      //  toSend[1] = value       
	
        
      //  if(read[reg-1] != value)	{
		//	console.log("Wysłałem do rejestru ["+Number(reg)+"] wartość ["+value+"]");
		//	websocket.send(JSON.stringify(toSend));
		//}
	}
	//init();