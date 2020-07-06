	function showSwList()	{
		var switchDiv = $("#switchesList");
		switchDiv.empty();
			
		for(i = 0; i < SwList.length; i++)	{
			s = SwList[i];
			newSwitch = document.createElement('li');
			$(newSwitch)
			.addClass("list-group-item list-group-item-action list-group-item-light")
			.attr({'role':'tab',"switchID":i})
			.click(function()	{
				$(this).parent().children().removeClass('active');
				$(this).addClass('active');
				editSwitch($(this).attr('switchID'));
			})
			.html("<span class='oi oi-grid-two-up'/> "+s.name+"<small class='oi oi-tag float-right' title='Adres'> Adres: "+s.address+"</small>");
			switchDiv.append(newSwitch);
		}
	}
	function timer()	{
		var timerValue = Number($("#timer").text());
		timerValue--;
		$("#timer").text(timerValue);
		status = getState("ADRES_PROGRAM_STATUS");
		if(status == 3)	{
			addressToProgram ++;
			if(addressToProgram > Number(amountJung)) addressToProgram = 1;
			setState("TRYB_SERWISOWY",2);	//Uruchom tryb serwisowy
			setState("ADRESS_TO_PROGRAM", addressToProgram);	//Nowy adres do zaprogramowania
			setState("TRIGER_ADRESS_PROGRAM",1); //Zacznij programować
		}
		if(timerValue < 18 && status == 6)	{
			addSwitch('done');
		}	else {
			if(timerValue <= 0) addSwitch('anuluj');
				else
			activeTimer = setTimeout(function() { timer() },1000);
		}
	}
	var amountJung;
	
	function addSwitch(flag)	{
		if(flag == "anuluj" || flag == "done")	{
			setState("TRYB_SERWISOWY",0);	
			setState("TRIGER_ADRESS_PROGRAM",0); 
			$("#anulujSwitch").addClass("d-none");
			$("#addSwitch")
			.removeClass("progress-bar progress-bar-striped progress-bar-animated disabled")
			.html('<span class="oi oi-loop-circular"/> Auto');
			$("#addSwitchManual").show();
		}else{
			$("#addSwitchManual").hide();
			amountJung = getState("AMOUNT_JUNG");
			
			if(SwList.length == 0) {
				addressToProgram = 1;
			} else	{
				addressToProgram = Number(SwList[SwList.length-1].address) + 1;
				if(addressToProgram > amountJung) addressToProgram = 1;
			}
			
			setState("ADRES_PROGRAM_STATUS",0);
			setState("TRYB_SERWISOWY",2);	//Uruchom tryb serwisowy
			setState("ADRESS_TO_PROGRAM", addressToProgram);	//Nowy adres do zaprogramowania
			setState("TRIGER_ADRESS_PROGRAM",1); //Zacznij programować
			$("#anulujSwitch").removeClass("d-none");
			$("#addSwitch")
			.addClass("progress-bar progress-bar-striped progress-bar-animated disabled")
			.html("<span class='d-inline'>Wciśnij przycisk serwisowy (<span id='timer'>20</span>s)</span>");
			timer();
		}
		if(flag == "done")	{			

			newAddress = getState("ADRESS_TO_PROGRAM");
			buttonsNumber = $("#switchNumber").val();
			SwList.push(new Switch("NAZWA ZADAJNIKA", newAddress, buttonsNumber ));
			showSwList();
		}
	}
	
	function editSwitch(sw)	{
		$("#switchName").val(SwList[sw].name);
		$("#switchAddress").val(SwList[sw].address);
		$("#switchNumber").val(SwList[sw].buttonsNumber).change();
		$("#editSwitch").show();
	}
	
	function removeSwitch(){
		sw = Number($("#switchesList").find('.active').attr('switchID'));
		var r = confirm("Chcesz usunąć ten element?");
		if (r == true) {
			SwList.splice(sw,1);
			$("#editSwitch").hide();
			showSwList(); 
		}
	}
	
	function saveSwitch()	{	
		sw = $("#switchesList").find('.active').attr('switchID');
		if(!sw) { alert("Wybierz zadajnik"); return;}
		if($("#switchName").val())
			SwList[sw].name = $("#switchName").val();
		else	
			alert("Pole nazwa nie może być puste");
		SwList[sw].address = $("#switchAddress").val();
		SwList[sw].buttonsNumber = $("#switchNumber").val();
		showSwList();
		$("[switchID='"+sw+"']").addClass('active');
	}
	
	function downloadAddress()	{
		adres = getState("ADRESS_ZADAJNIK_LAST_USE");	
		$("#switchAddress").val(adres)
	}
	
	 ////////////////////////////////////////////////
	  function addSwitchManual(){
		amountJung = getState("AMOUNT_JUNG");
		
		if(SwList.length == 0) {
			addressToProgram = 1;
		} else	{
			addressToProgram = Number(SwList[SwList.length-1].address) + 1;
			if(addressToProgram > amountJung) addressToProgram = 1;
		}
		SwList.push(new Switch("NAZWA ZADAJNIKA", addressToProgram, 4 ));
		showSwList();
 }
 
 var timerValue;
	function changeAddressS()	{
		addressToProgram = $("#switchAddress").val();
		setState("ADRES_PROGRAM_STATUS",0);				/// wyslanie inita
		setState("TRYB_SERWISOWY",2);	//Uruchom tryb serwisowy
		setState("ADRESS_TO_PROGRAM", addressToProgram);	//Nowy adres do zaprogramowania
		setState("TRIGER_ADRESS_PROGRAM",1); //Zacznij programowa捊		// doda栢utton o tym ID
		$("#changeSwitch") 
		.addClass("progress-bar progress-bar-striped progress-bar-animated disabled")
		.html("<span class='d-inline'>Programowanie ...</span>");
		timerValue = 7;
		activeTimer = setTimeout(function() { checkAddressSetS(); },1000);
	}
	var statusDisc = ['inicjalizacja',
						'sprawdzanie dostępności adresu',
						'adres jest wolny',
						'adres jest zajety',
						'programowanie w trakcie...',
						'błąd programowania',
						'poprawne zaprogramowane'];

	function checkAddressSetS()	{
    timerValue--;
	status = getState("ADRES_PROGRAM_STATUS");
    console.log(statusDisc[status]);
    $("#changeSwitch").html(statusDisc[status]);
		if(status == 3 || status == 6 || timerValue <= 0)	{	//Adres zajety

			setState("TRYB_SERWISOWY",0);	
			setState("TRIGER_ADRESS_PROGRAM",0); 
			clearTimeout(activeTimer);
			$("#changeSwitch") 
			.removeClass("progress-bar progress-bar-striped progress-bar-animated disabled")
			.html('<span class="oi oi-pencil"/> Przypisz');
			if(status == 3) alert("Ten adres jest aktualnie zajety, spróbuj inny");
			if(status == 6) {
				alert("Adres został przypisany");
				saveSwitch();
			}
		}
		else
		{
			activeTimer = setTimeout(function() { checkAddressSetS(); },1000);
		}
	}
	
	$(document).ready(function(){
		$("#switchName, #switchAddress, #switchNumber").change(function(){
			saveSwitch();
		});
	});