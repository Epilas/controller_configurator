	var icon = ['oi-lightbulb','oi-vertical-align-top','oi oi-contrast','oi-fire'];	
	
	var logikaNr=1;
	var logikaNrRolety = 121;
	var logikaNrSciemniacza = 171;
	
	function loadSwList()	{
		var switchDiv = $("#switchesList");
		switchDiv.empty();
		
			newSwitch = document.createElement('option');
			$(newSwitch)
			.attr({"disabled":"disabled","selected":"selected"})
			.html("Wybierz zadajnik ...");
			switchDiv.append(newSwitch);
			
		for(i = 0; i < SwList.length; i++)	{
			s = SwList[i];
			newSwitch = document.createElement('option');

			$(newSwitch)
			.attr({"value":i})
			.html(s.name);
			switchDiv.append(newSwitch);
		}
	}	
	
	function loadRlList()	{
		var relayDiv = $("#relaysList");
		relayDiv.empty();
		
		newRelay = document.createElement('a');
		$(newRelay)	
		.addClass("list-group-item list-group-item-action list-group-item-light")
		.click(function(){
			if(activeSwitch && activeBtn)	{
				SwList[activeSwitch].removeButton(activeBtn-1);
				showSwitch();
			}
		})
		.html("<span class='oi oi-trash'> Wyczyść</span>");
		relayDiv.append(newRelay)
		.append("<hr>");
		
					
					
		for(i = 0; i < CtrList.length; i++)	{
			c = CtrList[i];
			for(a = 0; a < 8; a++)	{
				r = c.relay[a];
				if(r != "" && c.mode != 3)	{
					newRelay = document.createElement('a');
					$(newRelay)	
					.addClass("list-group-item list-group-item-action list-group-item-light")
					.attr('ctr',i)
					.attr('relay',a)
					.click(function(){
						if(activeSwitch && activeBtn)	{
							SwList[activeSwitch].addButton(activeBtn-1, CtrList[$(this).attr('ctr')].getRelay($(this).attr('relay')) );
							showSwitch();
						}
					});

					$(newRelay)	
					.html("<span class='oi "+icon[c.mode]+"'/> <b> "+r+"</b> <small class='float-right'><span class='oi oi-monitor'/> "+c.name+"</small>");
					
					relayDiv.append(newRelay);
				}
			}
		}
	}
	
	var activeSwitch;
	
	function showSwitch()	{
		$("#switch").show();
		activeSwitch = $("#switchesList").val();
		s = SwList[activeSwitch];
		$("#btn1, #btn2, #btn3, #btn4").hide();
		for(i = 0; i < s.buttonsNumber; i++)	{
			b = $("#btn"+(i+1));
			b.show();
			if (s.button[i].length)	{
				title = "";
				if(s.button[i].length > 1)	{
				for(j = 0; j < s.button[i].length; j++)	{ title += s.button[i][j][2]+"\n"; }
					b.find('b').html("<span class='oi oi-grid-two-up'/> <span class='badge badge-light' title = '"+title+"'>"+s.button[i].length+"</span>");
				}	else	{
					if(s.button[i][0][3] != 3)
						b.find('b').html("<span class='oi "+icon[s.button[i][0][3]]+"'/> "+ s.button[i][0][2]);
				}
				b.removeClass("btn-secondary")
				 .addClass("btn-primary");
			}	else	{
				b.find('b').text("Pusty");
				b.removeClass("btn-primary")
				 .addClass("btn-secondary");
			}
		}
	}
	
	function search()	{
		input = $("#relaysSearch").val();
		filter = input.toUpperCase();
		sw = document.getElementById("relaysList");
		a = $(sw).find('a');
		for (i = 0; i < a.length; i++) {
			b = $(a[i]).find('b');
			small = $(a[i]).find('small');
			if (b.text().toUpperCase().indexOf(filter) > -1 || small.text().toUpperCase().indexOf(filter) > -1) {
				$(a[i]).show();
			} else {
				$(a[i]).hide();
			}
		}
	}
	
	var activeBtn;
	
	function editBtn(num)	{
		activeBtn = num;
		$("#btn1, #btn2, #btn3, #btn4")
		.removeClass('active')
		.addClass('disabled');
		
		$("#btn"+num)
		.removeClass('disabled')
		.addClass('active');
	}
				
	function loadFromFile(){
		var jqxhr = $.getJSON( "data.json",)
		  .always(function(r) {
			if(r.swList)	{
				SwList = [];
				for(i = 0; i < r.swList.length; i++) {
					SwList.push(new Switch(r.swList[i].name,r.swList[i].address,r.swList[i].buttonsNumber));
					for(j = 0; j < 3; j++)	
						SwList[i].addButton(j, r.swList[i].button[j] );
				}
				console.log( "SwList Loaded" );
			} 
			if(r.ctrList)	{
				CtrList = [];
				for(i = 0; i < r.ctrList.length; i++) {
					CtrList.push(new Controller(r.ctrList[i].address));
					for(j = 0; j < 7; j++)	
						CtrList[i].editRelay(j,r.ctrList[i].relay[j]);
				}
				console.log( "ctrList Loaded" );
			}  			
		  });
		load('config')
	}	
	
	var queue=[];
	
	function sendConfig()	{
		var r = confirm("Czy na pewno chcesz wysłać konfigurację do sterownika?");
		
		if(r == true)	{
			queue = [];

			for(a = 0; a < SwList.length; a++)	{
				for(b = 0; b < 4; b++) {
					for(c = 0; c < SwList[a].button[b].length; c++)	{
						if(SwList[a].button[b][c].length)	{
							if(SwList[a].button[b][c][3] == 0)	{
								queue.push({"a":"LOGIKA"+logikaNr+"_ZADAJNIK_ADRES","v":SwList[a].address});
								queue.push({"a":"LOGIKA"+logikaNr+"_ZADAJNIK_NR_INPUT","v":Number(b+1)});
								queue.push({"a":"LOGIKA"+logikaNr+"_WYKONAWCZY_NR_OUTPUT","v":SwList[a].button[b][c][1]});
								queue.push({"a":"LOGIKA"+logikaNr+"_WYKONAWCZY_ADRES","v":SwList[a].button[b][c][0]});
								logikaNr++;
							}	else	if(SwList[a].button[b][c][3] == 1){
								queue.push({"a":"LOGIKA"+logikaNrRolety+"_ZADAJNIK_ADRES","v":SwList[a].address});
								queue.push({"a":"LOGIKA"+logikaNrRolety+"_ZADAJNIK_NR_INPUT","v":Number(b+1)});
								queue.push({"a":"LOGIKA"+logikaNrRolety+"_WYKONAWCZY_NR_OUTPUT","v":SwList[a].button[b][c][1]});
								queue.push({"a":"LOGIKA"+logikaNrRolety+"_WYKONAWCZY_ADRES","v":SwList[a].button[b][c][0]});
								logikaNrRolety++;
							}	else	if(SwList[a].button[b][c][3] == 2){
								queue.push({"a":"LOGIKA"+logikaNrSciemniacza+"_ZADAJNIK_ADRES","v":SwList[a].address});
								queue.push({"a":"LOGIKA"+logikaNrSciemniacza+"_ZADAJNIK_NR_INPUT","v":Number(b+1)});
								queue.push({"a":"LOGIKA"+logikaNrSciemniacza+"_WYKONAWCZY_NR_OUTPUT","v":SwList[a].button[b][c][1]});
								queue.push({"a":"LOGIKA"+logikaNrSciemniacza+"_WYKONAWCZY_ADRES","v":SwList[a].button[b][c][0]});
								logikaNrSciemniacza++;
							}	
						}
					}
				}
			}

			$("#maxAmount").text(queue.length);
			$("#bottomPanelMsg").text("Trwa wysyłanie konfiguracji ");
			console.log(queue);
			sendGroup(queue);
			$('#bottomPanel').animate({'bottom':'5px'},500);
		}
	}
	
	var queueChanges = [];
	
	function sendChanges() {
		queueNew = [];
		for(a = 0; a < queueBefore.length; a++)	{
			if(JSON.stringify(queueBefore[a]) != JSON.stringify(queue[a]))
				queueNew.push(queue[a]);
		}
		if(queueNew.length > 0)	{
			$("#maxAmount").text(queueNew.length);
			sendGroup(queueNew);
			$('#bottomPanel').animate({'bottom':'5px'},500);
		} else {
			alert("Brak zmian w konfiguracji!");
		}
	}
	
	var autoTimer;
	function autoSelect(st)	{
		address = getState("ADRESS_ZADAJNIK_LAST_USE");	
		number = getState("NUMBER_INPUT_IN_ZADAJNIK_LAST_USE");
		$('#switchesList').children().removeAttr('selected');
		for(a = 0; a < SwList.length; a++)	{
			
			if(SwList[a].address == address)	{	
				$('#switchesList option[value='+a+']').attr('selected','selected');
				activeSwitch = a;
			}
			
		}
		showSwitch();
		editBtn(number);
		
		if(st == 0)	clearTimeout(autoTimer);
		if(st == 1)	autoTimer = setTimeout(function(){ autoSelect(1); }, 1000);
	}	
	
	//************
	// Ustawienia fabryczne
	//************
	function sendDefault()	{
		var r = confirm("Czy na pewno chcesz przywrócić ustawienia fabryczne?");
		
		queue = [];
		
		if(r == true)	{
			for(a = 1; a <= 200; a++)	{
				queue.push({"a":"LOGIKA"+a+"_ZADAJNIK_ADRES", "v": 0});
				queue.push({"a":"LOGIKA"+a+"_ZADAJNIK_NR_INPUT","v": 0});
				queue.push({"a":"LOGIKA"+a+"_WYKONAWCZY_NR_OUTPUT","v": 0});
				queue.push({"a":"LOGIKA"+a+"_WYKONAWCZY_ADRES","v":0});
			}
			
			$("#maxAmount").text(queue.length);
			$("#bottomPanelMsg").text("Trwa przywracanie do ustawień fabrycznych");
			sendGroup(queue);
			$('#bottomPanel').animate({'bottom':'5px'},500);
		}
	}
	
	$(document).ready(function(){
		loadSwList();
		loadRlList();
		$("#autoSelect").change(function(){
			if( $(this).prop('checked') == true )
				autoSelect(1);
			else
				autoSelect(0);
		});
	});	