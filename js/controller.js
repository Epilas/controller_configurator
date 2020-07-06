	function updateCtrList() 	{
		var controllerDiv = $("#controllerList");
		controllerDiv.empty();
	
		for(i = 0; i < CtrList.length; i++)	{
			c = CtrList[i];
			newController = document.createElement('li');
			$(newController)
			.addClass("list-group-item list-group-item-action list-group-item-light")
			.attr({'role':'tab','controllerID':i})
			.click(function() {	
				$(this).parent().children().removeClass('active');
				$(this).addClass('active');
				updateRelays($(this).attr('controllerID'));
			})
			.html("<span class='oi oi-monitor'/> "+c.name+" <small class='oi oi-tag float-right' title='Adres'> Adres: "+c.address+"</small>");
			
			controllerDiv.append(newController);
		}
	}
	
	
	function updateRelays(ctr)	{
		$("#removeCtr").show();
		$("#ctrName").removeAttr("disabled");
		$("#ctrMode").removeAttr("disabled");
		$("#ctrAddress").removeAttr("disabled");
		$("#changeCtr").removeAttr("disabled");
		$("#hideRelay8").show();
		$("#hideRelayTK1").hide();
		$("#hideRelayTK2").hide();
		if(CtrList[ctr].address == 1)	{
			$("#removeCtr").hide();
			$("#ctrName").attr("disabled","disabled");
			//$("#ctrMode").attr("disabled","disabled");
			$("#ctrAddress").attr("disabled","disabled");
			$("#changeCtr").attr("disabled","disabled");
			$("#hideRelay8").hide();
			$("#hideRelayTK1").show();
			$("#hideRelayTK2").show();
		}   
		$("#ctrMode").children().removeAttr('selected');
		$("#ctrMode option[value='"+CtrList[ctr].mode+"']").attr('selected','selected');
		$("#ctrName").val(CtrList[ctr].name);
		$("#ctrAddress").val(CtrList[ctr].address);
		$("#editRelays").show();
		$("#saveRelaysBtn").removeClass("btn-primary");
		if(CtrList[ctr].address == 1)	{
			for(a = 0; a < 7; a++)	{
				$("#relay"+(a+1)).val(CtrList[ctr].relay[a]);
			}
			$("#relayTK1").val(CtrList[ctr].relay[9]);
			$("#relayTK2").val(CtrList[ctr].relay[10]);
		} else {
			for(a = 0; a < 8; a++)	{
				$("#relay"+(a+1)).val(CtrList[ctr].relay[a]);
			}
		}
	}
	
	function saveRelays()	{
		ctr = $("#controllerList").find('.active').attr('controllerID');
		for(i = 0; i < 8; i++){
			name = $("#relay"+(i+1)).val();
			CtrList[ctr].editRelay(i,name);
		}
		CtrList[ctr].name = $("#ctrName").val();
		CtrList[ctr].address = $("#ctrAddress").val();
		updateCtrList();
		$("[controllerID='"+ctr+"']").addClass('active');
		console.log("Zapisano CTR");
	}
	
	function removeCtr(){
		ctr = Number($("#controllerList").find('.active').attr('controllerID'));
		var r = confirm("Chcesz usunąć ten element?");
		if (r == true) {
			CtrList.splice(ctr,1);
			$("#editRelays").hide();
			updateCtrList(); 
		}
	}
	
	function timerCtr()	{
		var timerValue = Number($("#timerCtr").text());
		timerValue--;
		$("#timerCtr").text(timerValue);
		status = getState("ADRES_PROGRAM_STATUS");

		if(status == 3)	{
			addressToProgram ++;
			if(addressToProgram > (Number(amountExecute)+100)) addressToProgram = 100;
			setState("TRYB_SERWISOWY",2);	//Uruchom tryb serwisowy
			setState("ADRESS_TO_PROGRAM", addressToProgram);	//Nowy adres do zaprogramowania
			setState("TRIGER_ADRESS_PROGRAM",1); //Zacznij programować
		}
		if(timerValue < 18 && status == 6)	{
			addController('done');
		}	else {
			if(timerValue <= 0) addController('anuluj');
				else
			activeTimer = setTimeout(function() { timerCtr() },1000);
		}
	}
	
	var addressToProgram;
	var amountExecute;
	
	function addController(flag)	{
		if(flag == "anuluj" || flag == "done")	{
			setState("TRYB_SERWISOWY",0);	
			setState("TRIGER_ADRESS_PROGRAM",0); 
			$("#anulujCtr").addClass("d-none");
			$("#addCtr")
			.removeClass("progress-bar progress-bar-striped progress-bar-animated disabled")
			.html('<span class="oi oi-loop-circular"/> Auto');
			$("#addCtrManual").show();
		}else{
			$("#addCtrManual").hide();
			addressToProgram = 100;
			amountExecute = getState("AMOUNT_EXECUTE");
			if(addressToProgram > (Number(amountExecute)+100)) addressToProgram = 100;
			
			setState("ADRES_PROGRAM_STATUS",0);
			setState("TRYB_SERWISOWY",2);	//Uruchom tryb serwisowy
			setState("ADRESS_TO_PROGRAM", addressToProgram);	//Nowy adres do zaprogramowania
			setState("TRIGER_ADRESS_PROGRAM",1); //Zacznij programować
			$("#anulujCtr").removeClass("d-none");
			$("#addCtr")
			.addClass("progress-bar progress-bar-striped progress-bar-animated disabled")
			.html("<span class='d-inline'>Wciśnij przycisk serwisowy (<span id='timerCtr'>20</span>s)</span>");
			timerCtr();
		}
		if(flag == "done")	{			
			newAddress = getState("ADRESS_TO_PROGRAM");
			CtrList.push(new Controller(newAddress));
			updateCtrList();
		}
	}
 
 function addControllerManual(){
 	if(CtrList.length == 0)	{
			newAddress = 100;
		} else {
			newAddress = Number(CtrList[CtrList.length-1].address) + 1;
		}
		CtrList.push(new Controller(newAddress));
		updateCtrList();
 }
	
	function changeMode(){
		ctr = $("#controllerList").find('.active').attr('controllerID');
		CtrList[ctr].mode = $("#ctrMode").val();
		if($("#ctrMode").val() == 1)	{
			setState("ADRES_EXECUTE_ROLER_LIGHT", $("#ctrAddress").val());
			setState("LIGHT_ROLLER_FUNCTION", $("#ctrMode").val());
			setState("TIME_MOVE_ROLLER", 200);
			//setState("TRIGGER_PROG_EXECUTE_ROLLER_LIGHT",0);
			setTimeout(function()	{setState("TRIGGER_PROG_EXECUTE_ROLLER_LIGHT",1);},1500);
			setTimeout(function()	{setState("TRIGGER_PROG_EXECUTE_ROLLER_LIGHT",0);},3000);
		} else {
			setState("ADRES_EXECUTE_ROLER_LIGHT", $("#ctrAddress").val());
			setState("LIGHT_ROLLER_FUNCTION", $("#ctrMode").val());
			//setState("TRIGGER_PROG_EXECUTE_ROLLER_LIGHT",0);
			setTimeout(function()	{setState("TRIGGER_PROG_EXECUTE_ROLLER_LIGHT",1);},1500);
			setTimeout(function()	{setState("TRIGGER_PROG_EXECUTE_ROLLER_LIGHT",0);},3000);
			
		}
		for(i = 0; i < SwList.length; i++)	{
			for(j = 0; j < 4; j++)	{
				for(k = 0; k < SwList[i].button[j].length; k++)	{
					if(SwList[i].button[j][k][0] == CtrList[ctr].address) {
						
						console.log("ZNALEZIONO: "+SwList[i].button[j][k][0])
						SwList[i].button[j] = [];
					}
				}
			}
		}
		updateRelays(ctr)
	}
 
 ////////////////////////////////////////////////
 var timerValue;
	function changeAddress()	{
		addressToProgram = $("#ctrAddress").val();
		setState("ADRES_PROGRAM_STATUS",0);
		setState("TRYB_SERWISOWY",2);	//Uruchom tryb serwisowy
		setState("ADRESS_TO_PROGRAM", addressToProgram);	//Nowy adres do zaprogramowania
		setState("TRIGER_ADRESS_PROGRAM",1); //Zacznij programowa�
		// doda� button o tym ID
		$("#changeCtr") 
		.addClass("progress-bar progress-bar-striped progress-bar-animated disabled")
		.html("<span class='d-inline'>Programowanie ...</span>");
		timerValue = 7;
		activeTimer = setTimeout(function() { checkAddressSet(); },1000);
	}
	var statusDisc = ['inicjalizacja',
'sprawdzanie dostępności adresu',
'adres jest wolny',
'adres jest zajety',
'programowanie w trakcie...',
'błąd programowania',
'poprawne zaprogramowane'];

	function checkAddressSet()	{
    timerValue--;
		status = getState("ADRES_PROGRAM_STATUS");
    console.log(statusDisc[status]);
    $("#changeCtr").html(statusDisc[status]);
		if(status == 3 || status == 6 || timerValue <= 0)	{	//Adres zajety
			if(status == 3) alert("Ten adres jest aktualnie zajety, spróbuj inny");
			if(status == 6) alert("Adres został przypisany");

			setState("TRYB_SERWISOWY",0);	
			setState("TRIGER_ADRESS_PROGRAM",0); 
			clearTimeout(activeTimer);
			$("#changeCtr") 
			.removeClass("progress-bar progress-bar-striped progress-bar-animated disabled")
			.html('<span class="oi oi-pencil"/> Przypisz');
      saveRelays();
		}
		else
		{
			activeTimer = setTimeout(function() { checkAddressSet(); },1000);
		}
	}
	
	$(document).ready(function(){
		$("#ctrName, #ctrMode, #ctrAddress, #relay1, #relay2, #relay3, #relay4, #relay5, #relay6, #relay7, #relay8").change(function(){
			saveRelays();
		});
		
		$("#ctrMode").change(function(){
			console.log("CHANGE");
			changeMode();
		});
	});