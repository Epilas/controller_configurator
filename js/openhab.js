	var icon = ['oi-lightbulb','oi-vertical-align-top','oi oi-contrast','oi-fire'];
	var openhabIcon = ['','attic','bath','bedroom','cellar','corridor','firstfloor','garage','garden','groundfloor','kitchen','office','terrace',
						'battery','blinds','camera','door','frontdoor','garagedoor','lawnmower','lightbulb','lock','poweroutlet','projector','receiver','screen','siren','wallswitch','whitegood',
						'window','colorpicker','group','rollershutter','slider','switch','text','humidity','moon','rain','snow','sun','sun_clouds','temperature','wind',
						'batterylevel','carbondioxide','colorlight','energy','fire','flow','gas','light','lowbattery','motion','oil','pressure','price','qualityofservice',
						'smoke','soundvolume','time','water','alarm','party','vacation','fan','greenhouse','house','keyring','network','radiator','rgb','settings','shield','sofa','solarplant','toilet','video','wardrobe'];
	var iconOptions =[];
	
	for(a = 0; a < openhabIcon.length; a++)
		iconOptions += "<option value = '"+openhabIcon[a]+"'>"+openhabIcon[a]+"</option>";

	function loadRlList()	{
		var relayDiv = $("#listOfRelays");
		relayDiv.empty();
						
		for(i = 0; i < CtrList.length; i++)	{
			c = CtrList[i];
			
			// Relays
			for(a = 0; a < 8; a++)	{
				r = c.relay[a];
				if(r != "" && c.mode != 3)	{
					newRelay = document.createElement('a');
					$(newRelay)	
					.addClass("list-group-item list-group-item-action list-group-item-light")
					.attr('address',c.address)
					.attr('relay', a+1)
					.attr('mode', c.mode)
					.click(function(){
						addRelay($(this).find("b").text(), $(this).attr('address'), $(this).attr('relay'), $(this).attr('mode') );
					});

					$(newRelay)	
					.html("<span class='oi "+icon[c.mode]+"'/> <b> "+r+"</b> <small class='float-right'><span class='oi oi-monitor'/> "+c.name+"</small>");
						
					relayDiv.append(newRelay);
				}
			}
		}
		// Heating zones
		for(a = 0; a < zone.length; a++)	{
			
			przekaznik = -1;
			mod = -1;
			for(b = 0; b < CtrList.length; b++)
				if(CtrList[b].address == zone[a].modul)	{
					console.log( zone[a].modul);
					przekaznik = CtrList[b].relay[zone[a].przekaznik-1];
					mod = CtrList[b].name;
				}
				
			zadajnik = -1;
			for(c = 0; c < SwList.length; c++)
			if(SwList[c].address == zone[a].zadajnik)	{
				zadajnik = SwList[c].name;
			}
			
			newRelay = document.createElement('a');
			$(newRelay)	
			.addClass("list-group-item list-group-item-action list-group-item-light")
			.attr('zone', a)
			.click(function(){
				//addRelay($(this).find("b").text(), $(this).attr('address'), $(this).attr('relay'), $(this).attr('mode') );
				addZone($(this).find("b").text(), $(this).attr('zone'));
			});

			$(newRelay)	
			.html("<span class='oi "+icon[3]+"'/> <b> "+zadajnik+" - "+przekaznik+"</b> <small class='float-right'><span class='oi oi-monitor'/> "+mod+"</small>");
				
			relayDiv.append(newRelay);
		}
		
		// SATEL
		for(a = 0; a < satel.length; a++)	{
			if(satel[a].active)	{
				newSatel = document.createElement('a');
				$(newSatel)	
				.addClass("list-group-item list-group-item-action list-group-item-light")
				.attr('satel', a)
				.click(function(){
					addSatel($(this).attr('satel'));
				});				
				$(newSatel)	
				.html("<span class='oi oi-shield'/> <b> "+satel[a].disp+"</b> <small class='float-right'><span class='oi oi-monitor'/> SATEL</small>");		
				relayDiv.append(newSatel);
			}
		}
	}
	var groups;
	if(groups == undefined ) var groups = new Array();
	
	function loadGroupList()	{
		g = $("#groupList");
		if(groups.length >= 0) g.empty();
		//////////////////////////////////////////////////////////////////////// i
		for(i = 0; i < groups.length; i++){
			firstRowLi = document.createElement('li');
			firstRowUl = document.createElement('ul');
			$(firstRowLi)
				.addClass("grupa list-group-item")
				.attr('i',i)         
				.attr('j',-1)
				.attr('k',-1)
				.html("<span class='oi oi-minus'/> "+groups[i].name)
				.append("<div class='float-right'> <span class='oi oi-folder'/> <span class='oi oi-pencil'/> <span class='oi oi-trash'/></div>");
				
			if($(firstRowLi).hasClass("grupa"))
				$(firstRowLi).click(function() { selectGroup($(this).attr('i'),$(this).attr('j'),$(this).attr('k')); });
			
			
			$(firstRowLi)	
				.find('.oi-pencil')
					.click(function()	{
						ii = $(this).parent().parent().attr('i');
						renameGroup(ii);
					});
					
			$(firstRowLi)	
				.find('.oi-folder')
					.click(function()	{
						ii = $(this).parent().parent().attr('i');
						addGroup(ii);
					});
							
			$(firstRowLi)	
				.find('.oi-trash')
					.click(function()	{
						ii = $(this).parent().parent().attr('i');
						removeElement(ii);
					});
			$(firstRowLi)				
				.find(".oi-minus")
				.click(function(){
					$(this).parent().next().toggle();
					$(this).toggleClass("oi-plus");
				});
			$(firstRowUl)
				.addClass("list-group")
			g.append(firstRowLi);
			g.append(firstRowUl);
			if(groups[i].elements)
				//////////////////////////////////////////////////////////////// j
				for(j = 0; j < groups[i].elements.length; j++)	{
					secondRowLi = document.createElement('li');
					secondRowUl = document.createElement('ul');
					if(!groups[i].elements[j].elements)	{
							if(groups[i].elements[j].satel != undefined)
								$(secondRowLi)
								.html("<span class='oi oi-shield'></span> "+groups[i].elements[j].name)
								.append("<div class='float-right'><span class='oi oi-brush'/> <span class='oi oi-pencil'></span> <span class='oi oi-trash'></span></div>");
							else
								$(secondRowLi)
								.html("<span class='oi "+icon[groups[i].elements[j].mode]+"'></span> "+groups[i].elements[j].name)
								.append("<div class='float-right'><span class='oi oi-brush'/> <span class='oi oi-pencil'></span> <span class='oi oi-trash'></span></div>");

							$(secondRowLi)	
							.find('.oi-brush')
							.click(function()	{
								ii = $(this).parent().parent().attr('i');
								jj = $(this).parent().parent().attr('j');
								$('.openhabIcon')
								.attr('i',ii)
								.attr('j',jj)
								.attr('k',-1);
								
								$('#iconModal').modal();
								
								if(groups[ii].elements[jj].icon)
									$("#actualOpenHabIcon").text(groups[ii].elements[jj].icon);
								else
									$("#actualOpenHabIcon").text("---");	
							});	
					}	else	{
						$(secondRowLi)
							.addClass("grupa")
							.html("<span class='oi oi-minus'></span>"+groups[i].elements[j].name)
							.append("<div class='float-right'><span class='oi oi-brush'/> <span class='oi oi-pencil'/> <span class='oi oi-trash'/></div>");


							$(secondRowLi)	
							.find('.oi-brush')
							.click(function()	{
								ii = $(this).parent().parent().attr('i');
								jj = $(this).parent().parent().attr('j');
								$('.openhabIcon')
								.attr('i',ii)
								.attr('j',jj)
								.attr('k',-1);
								
								$('#iconModal').modal();
								
								if(groups[ii].elements[jj].icon){
									$("#actualOpenHabIcon").text(groups[ii].elements[jj].icon);
									$("#openhabIMG").attr("src","https://www.openhab.org/iconsets/classic/"+groups[ii].elements[jj].icon+".png");
								}else{
									$("#actualOpenHabIcon").text("---");
								}									
							});		

							$(secondRowLi)
							.find(".oi-minus")
							.click(function(){
								$(this).parent().next().toggle();
								$(this).toggleClass("oi-plus");
							});
					}
					
					$(secondRowLi)	
						.find('.oi-pencil')
						.click(function()	{
							ii = $(this).parent().parent().attr('i');
							jj = $(this).parent().parent().attr('j');
							renameGroup(ii,jj);
						});
					
					$(secondRowLi)
						.addClass("list-group-item nextRow")
						.attr('i',i)
						.attr('j',j)
						.attr('k',-1)
						.find('.oi-trash')
						.click(function()	{
							ii = $(this).parent().parent().attr('i');
							jj = $(this).parent().parent().attr('j');
							removeElement(ii,jj);
					});
						
					if($(secondRowLi).hasClass("grupa"))
					$(secondRowLi).click(function() { selectGroup($(this).attr('i'),$(this).attr('j'),$(this).attr('k')); });
			
				
					$(secondRowUl)
						.addClass("list-group nextRow");
					firstRowUl.append(secondRowLi);	
					firstRowUl.append(secondRowUl);	
					
				if(groups[i].elements[j].elements)
					/////////////////////////////////////////////////////////////// k
					for(k = 0; k < groups[i].elements[j].elements.length; k++)	{
						thirdRowLi = document.createElement('li');
						$(thirdRowLi)
							.addClass("list-group-item nextRow")
							.attr('i',i)
							.attr('j',j)
							.attr('k',k);
							
							if(groups[i].elements[j].elements[k].satel != undefined)
								$(thirdRowLi)
								.html("<span class='oi oi-shield'></span> "+groups[i].elements[j].elements[k].name);
							else
								$(thirdRowLi)
								.html("<span class='oi "+icon[groups[i].elements[j].elements[k].mode]+"'></span> "+groups[i].elements[j].elements[k].name);
							
							$(thirdRowLi)	
							.append("<div class='float-right'><span class='oi oi-brush'/> <span class='oi oi-pencil'></span> <span class='oi oi-trash'></span></div>")
							.find('.oi-trash')
							.click(function()	{
								ii = $(this).parent().parent().attr('i');
								jj = $(this).parent().parent().attr('j');
								kk = $(this).parent().parent().attr('k');
								removeElement(ii,jj,kk);
							});
							
							$(thirdRowLi)	
							.find('.oi-brush')
							.click(function()	{
								ii = $(this).parent().parent().attr('i');
								jj = $(this).parent().parent().attr('j');
								kk = $(this).parent().parent().attr('k');
								$('.openhabIcon')
								.attr('i',ii)
								.attr('j',jj)
								.attr('k',kk);
								
								$('#iconModal').modal();
								
								if(groups[ii].elements[jj].elements[kk].icon){
									$("#actualOpenHabIcon").text(groups[ii].elements[jj].elements[kk].icon);
									$("#openhabIMG").attr("src","https://www.openhab.org/iconsets/classic/"+groups[ii].elements[jj].elements[kk].icon+".png");
								}else{
									$("#actualOpenHabIcon").text("---");
								}
							});	
							
							$(thirdRowLi)	
							.find('.oi-pencil')
							.click(function()	{
								ii = $(this).parent().parent().attr('i');
								jj = $(this).parent().parent().attr('j');
								kk = $(this).parent().parent().attr('k');
								renameGroup(ii,jj,kk);
							});
							
						secondRowUl.append(thirdRowLi);
					}
			}
		}
	}
		
	function removeElement(ii,jj,kk)	{
		console.log(ii+","+jj+","+kk)
		var r = confirm("Chcesz usunąć element?");
		if(r == true)	{
			if(ii && jj && kk)	{
				groups[ii].elements[jj].elements.splice(kk,1);
			}	else
			if(ii && jj)	{
				groups[ii].elements.splice(jj,1);
			} else
			if(ii)	{
				groups.splice(ii,1);
			}	
			loadGroupList();
		}
	}
	
	function selectGroup(ii,jj,kk)	{
		selectedI = ii;
		selectedJ = jj;
		selectedK = kk;
		console.log(ii+","+jj+","+kk)
		$(".list-group-item").removeClass('active');
		
		if(ii && jj && kk)	{
			$("[i="+ii+"][j="+jj+"][k="+kk+"]").addClass('active');
		}	else
		if(ii && jj)	{
			$("[i="+ii+"][j="+jj+"][k=-1]").addClass('active');
		} else
		if(ii)	{
			$("[i="+ii+"][j=-1][k=-1]").addClass('active');
		}	
	}
	
	function addGroup(ii)	{
		newElement = JSON.parse('{"name":"Nowa Grupa","icon":"door-closed", "elements":[]}');
		if(ii)	{
			groups[ii].elements.push(newElement);
		}	else{
			groups.push(newElement);
		}	
		loadGroupList();		
	}
	
	function addRelay(name, address, relay, mode)	{
		newElement = JSON.parse('{"name":"'+name+'","address":'+address+',"relay":'+relay+', "mode": '+mode+'}');
		if(selectedI >= 0 && selectedJ >= 0 && selectedK >= 0)	{
			groups[selectedI].elements[selectedJ].elements[selectedK].elements.push(newElement); 
		}	else
		if(selectedI >= 0 && selectedJ >=0)	{
			groups[selectedI].elements[selectedJ].elements.push(newElement);
		} else
		if(selectedI >= 0)	{
			groups[selectedI].elements.push(newElement);
		}
		loadGroupList();
		selectGroup(selectedI,selectedJ,selectedK);
	}
	
	function addZone(_name, _zone)	{
		newElement = JSON.parse('{"name":"'+_name+'","zone":"'+_zone+'","mode":3}');
		if(selectedI >= 0 && selectedJ >= 0 && selectedK >= 0)	{
			groups[selectedI].elements[selectedJ].elements[selectedK].elements.push(newElement); 
		}	else
		if(selectedI >= 0 && selectedJ >=0)	{
			groups[selectedI].elements[selectedJ].elements.push(newElement);
		} else
		if(selectedI >= 0)	{
			groups[selectedI].elements.push(newElement);
		}
		loadGroupList();
		selectGroup(selectedI,selectedJ,selectedK);
	}
	
	function addSatel(_satel)	{
		s = satel[_satel];
		newElement = JSON.parse('{"name":"'+s.disp+'","satel": '+_satel+'}');
		if(selectedI >= 0 && selectedJ >= 0 && selectedK >= 0)	{
			groups[selectedI].elements[selectedJ].elements[selectedK].elements.push(newElement); 
		}	else
		if(selectedI >= 0 && selectedJ >=0)	{
			groups[selectedI].elements[selectedJ].elements.push(newElement);
		} else
		if(selectedI >= 0)	{
			groups[selectedI].elements.push(newElement);
		}
		loadGroupList();
		selectGroup(selectedI,selectedJ,selectedK);
	}
	
	function renameGroup(ii,jj,kk)	{
		console.log(ii,jj,kk);
		var p = prompt("Wpisz nową nazwę");
		if(p)	{
			if(ii && jj && kk)	{
				groups[ii].elements[jj].elements[kk].name = p;
			} else 
			if(ii && jj)	{
				groups[ii].elements[jj].name = p;
			} else
			if(ii)	{
				groups[ii].name = p;
			}
		} else {
			alert("Pole nie może być puste!");
		}
		loadGroupList();
	}


	function changeIcon(ii,jj,kk, _i)	{
		if(ii >= 0 && jj >= 0 && kk >= 0)	{
			groups[ii].elements[jj].elements[kk].icon = _i;
		} else 
		if(ii >= 0 && jj >= 0)	{
			groups[ii].elements[jj].icon = _i;
		} else
		if(ii >= 0)	{
			groups[ii].icon = _i;
		}
		console.log(ii,jj,kk,_i);
	}
	
	function pad(d) {
		return (d < 10) ? '0' + d.toString() : d.toString();
	}

	var icons = ['light','rollershutter','heating','radiator'];

	function createSitemap()	{
		var siteName = prompt("Wprowadź nazwę Sitemap");

		output = 'sitemap '+siteName+' label="'+siteName+'" {\n';
			for(i = 0; i < groups.length; i++)	{
				//_icon = groups[i].icon;
				output += '\tFrame	label="'+groups[i].name+'" {\n';
				for(j = 0; j < groups[i].elements.length; j++)	{	
					if(!groups[i].elements[j].elements)	{
						///////////////////////////////////////////////////
						if(groups[i].elements[j].address == 1)	{
							item = 'C01_OUT'+groups[i].elements[j].relay;
						}	else	{
							item = 'E'+pad(groups[i].elements[j].address-99)+'_OUT'+groups[i].elements[j].relay;
						}
						/////////////////////////////////////////////////////
							if(groups[i].elements[j].mode == 3)	{
								_z = 'ZADAJNIK'+(Number(zone[groups[i].elements[j].zone].zadajnik))+'_TEMP'; 
								_g = 'GRZANIE'+(Number(groups[i].elements[j].zone)+1)+'_TEMPERATURA_ZADANA'; 
								output += '\t\tText		item='+_z+'		label="Temperatura aktualna [JS(dzielenie10_1.js):%s]"	icon="temperature"\n\
		Setpoint		item='+_g+'		label="Temperatura zadana"	 minValue=15 maxValue=30 step=1 icon="heating"\n';	
							} else if(groups[i].elements[j].satel != undefined)	{
								s = groups[i].elements[j].satel;
								if(groups[i].elements[j].icon)
									_icon = groups[i].elements[j].icon;
								else
									_icon = "shield";
								output += '\t\t'+satel[	s ].type+'	item='+satel[ s ].obj+'		label="'+groups[i].elements[j].name+' [%s]"	icon="'+_icon+'"\n';	
							} else {
								if(groups[i].elements[j].icon)
									_icon = groups[i].elements[j].icon;
								else
									_icon = icons[groups[i].elements[j].mode];
								
								output += '\t\tSwitch		item='+item+'		label="'+groups[i].elements[j].name+'"	icon="'+_icon+'"\n';	
							}
					}else{
						if(groups[i].elements[j].icon)
							_icon = groups[i].elements[j].icon;
						else
							_icon = "light";
						
						output += '\t\tText label="'+groups[i].elements[j].name+'" icon="'+_icon+'"	{\n\t\tFrame	label="'+groups[i].elements[j].name+'"	{\n';
						
						for(k = 0; k < groups[i].elements[j].elements.length; k++)	{
							///////////////////////////////////////////////////////
							if(groups[i].elements[j].elements[k].address == 1)
								item = 'C01_OUT'+groups[i].elements[j].elements[k].relay;
							else
								item = 'E'+pad(groups[i].elements[j].elements[k].address-99)+'_OUT'+groups[i].elements[j].elements[k].relay;
							/////////////////////////////////////////////////////////
							 
							if(groups[i].elements[j].elements[k].mode == 3){
								_z = 'ZADAJNIK'+(Number(zone[groups[i].elements[j].elements[k].zone].zadajnik))+'_TEMP'; 
								_g = 'GRZANIE'+(Number(groups[i].elements[j].elements[k].zone)+1)+'_TEMPERATURA_ZADANA';
								output += '\t\t\tText		item='+_z+'		label="Temperatura aktualna [JS(dzielenie10_1.js):%s]"	icon="temperature"\n\
			Setpoint		item='+_g+'		label="Temperatura zadana"	 minValue=15 maxValue=30 step=1 icon="heating"\n';	
							}else if(groups[i].elements[j].elements[k].satel != undefined)	{
								s = groups[i].elements[j].elements[k].satel;
								if(groups[i].elements[j].elements[k].icon)
									_icon = groups[i].elements[j].elements[k].icon;
								else
									_icon = "shield";
								output += '\t\t'+satel[	s ].type+'	item='+satel[ s ].obj+'		label="'+groups[i].elements[j].elements[k].name+' [%s]"	icon="'+_icon+'"\n';	
							}else{
								if(groups[i].elements[j].elements[k].icon)
									_icon = groups[i].elements[j].elements[k].icon;
								else
									_icon = icons[groups[i].elements[j].elements[k].mode];
								
								output += '\t\t\tSwitch		item='+item+'		label="'+groups[i].elements[j].elements[k].name+'"	icon="'+_icon+'"\n';	
							}
								
								
								//output += '\t\t\t\tSwitch		item='+item+'		label="'+groups[i].elements[j].elements[k].name+'"	icon="'+icons[groups[i].elements[j].elements[k].mode]+'"\n';
						}
						output += '\t\t}\n\
		}\n';
					}
				}
				output += '\t}\n'
			}
		output += '}';	
		console.log(output);
	
		if(siteName)	{
			var request = $.ajax
			({
				url        : "smarthome/openhab/sitemap/write/"+siteName,
				timeout		:	3000, 
				type       	: 	"POST",
				data       	: 	output, 
				headers    	: 	{"Content-Type": "text/plain", "Accept": "application/json"},
				dataType	:	"json"
			});
			
			request.done( function(data) 
			{ 
				if(data.status == "success")	{
					alert("Sitemap został zapisany");
					loadOpenhab();
				}else{
					alert("Wprowadzono złą nazwę");
				}
			});
			
			request.fail( function(jqXHR, textStatus ) 
			{ 
				console.log( "Failure: " + textStatus );
			});
		} else {
			alert("Wprowadź nazwę");
		}
		
	}
	
	function searchRelay()	{
		input = $("#searchRelayInput").val();
		filter = input.toUpperCase();
		sw = document.getElementById("listOfRelays");
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
	
	function loadOpenhab()	{
		
		var request = $.ajax
			({
				url        : "smarthome/openhab/sitemap/list",
			//	timeout		:	3000, 
				type       	: 	"POST",
			//	data       	: 	output, 
				headers    	: 	{"Content-Type": "text/plain", "Accept": "application/json"},
				dataType	:	"json"
			});
			
			request.done( function(data) 
			{ 
				console.log(data);
				$("#openhab").empty();
				if(data.status == "success")
					for(i = 0; i < data.result.length; i++)	{
						$("#openhab").append('<div class="btn-group mr-1"><a class="btn btn-sm btn-primary" href="basicui/app?sitemap='+data.result[i]+'" target="_blank">'+data.result[i]+'</a><a href="#" onclick="deleteOpenhab(\''+data.result[i]+'\')" class="btn btn-sm btn-danger"><span class="oi oi-x"/></a></div>');
					}
			});
			
			request.fail( function(jqXHR, textStatus ) 
			{ 
				console.log( "Failure: " + textStatus );
			});
	}
	loadOpenhab();
	
	function deleteOpenhab(nazwa)	{
		var r = confirm("Na pewno chcesz usunąć sitemap: "+nazwa+"?");
		if(r)	{
			var request = $.ajax
			({
				url        : "smarthome/openhab/sitemap/delete/"+nazwa,
				timeout		:	3000, 
				type       	: 	"POST",
			//	data       	: 	output, 
				headers    	: 	{"Content-Type": "text/plain", "Accept": "application/json"},
				dataType	:	"json"
			});
			
			request.done( function(data) 
			{ 
				console.log(data);
				if(data.status == "success")	{
					alert("Sitemap usunięty");
					loadOpenhab();
				}	else	{
					alert("Wystąpił bład");
				}
			});
			
			request.fail( function(jqXHR, textStatus ) 
			{ 
				console.log( "Failure: " + textStatus );
			});
			
		}
	}
	
	$(document).ready(function(){
		$(".openhabIcon")
		.empty()
		.append(iconOptions)
		.change(function(){
			ii = $(this).attr('i');
			jj = $(this).attr('j');
			kk = $(this).attr('k');
			changeIcon(ii,jj,kk,$(this).val());
			$("#openhabIMG").attr("src","https://www.openhab.org/iconsets/classic/"+$(this).val()+".png");
			$("#actualOpenHabIcon").text($(this).val());
		});
	});