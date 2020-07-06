	
// Switch object and functions
	function Switch(name, address, buttons) {
		this.address = address;
		this.name = name;
		this.buttonsNumber = buttons;
		this.button = new Array([],[],[],[]);
	}
	Switch.prototype.addButton = function(buttonNumber, relayObject)	{
		this.button[buttonNumber].push(relayObject);	
	}
	
	Switch.prototype.removeButton = function(buttonNumber)	{
		this.button[buttonNumber] = [];
	}

//** **//

// Controller object
	function Controller(address, name, mode) {
		if(name)	
			this.name = name;
		else
			this.name = "Sterownik "+address;
		
		if(mode)
			this.mode = mode;
		else
			this.mode = "0";
		
		this.address = address;
		this.relay = ["","","","","","","","",];
	}
	Controller.prototype.editRelay = function(id, name)	{
		this.relay[id] = name;
	}	
	Controller.prototype.getRelay = function(id)	{
		return [this.address, Number(id)+1, this.relay[id], this.mode];
	}	
//** **//

// Group object
	function Group(name) {
		this.name = name;
		this.relay = [];
	}
	Group.prototype.addRelay = function(relayObject)	{
		this.relay.push(relayObject);	
	}	
//** **//

	var SwList = new Array();	//Switches list
	var CtrList = new Array();	//Controllers list
	
	//Generate some switches
	/*SwList.push(new Switch("Salon przy wejściu po lewej",11,4));
	SwList.push(new Switch("Schody góra",12,4));
	SwList.push(new Switch("Bawialnia",13,4));
	*/
	//Generate some controllers
	CtrList.push(new Controller(1,"MASTER"));
	
	/*CtrList[0].editRelay(0,"Jakiś przekaźnik");
	CtrList[0].editRelay(2,"Jakiś przekaźnik 2");
	CtrList[1].editRelay(4,"Jakiś przekaźnik 3");
	
	//Add button to switch
	SwList[0].addButton(3, CtrList[0].getRelay(0) );
	SwList[0].addButton(1, CtrList[0].getRelay(2) );*/
			
	function load(url)	{
		$( ".wrapper" ).load( url+".html" );		
	}
	
	var satel = [{"disp": "Załącz czuwanie bezwzględnie", "obj":"SATEL_ARM_FORCE", "acive":false, "type":"Switch"},
			{"disp": "Załącz czuwanie normalne", "obj":"SATEL_ARM", "active":false, "type":"Switch"},
			{"disp": "Stan systemu", "obj":"SAT_OUTPUT_50a", "active":false, "type":"Text"},
			{"disp": "Awaria", "obj":"SAT_OUTPUT_51", "active":false, "type":"Text"},
			{"disp": "Alarm pożarowy", "obj":"SAT_OUTPUT_52", "active":false, "type":"Text"},
			{"disp": "Awaria zalaniowy", "obj":"SAT_OUTPUT_53", "active":false, "type":"Text"},
			{"disp": "Awaria włamaniowy", "obj":"SAT_OUTPUT_54", "active":false, "type":"Text"},
			{"disp": "SAT_INPUT_01", "obj":"SAT_INPUT_1", "active":false, "type":"Text"},
			{"disp": "SAT_INPUT_02", "obj":"SAT_INPUT_2", "active":false, "type":"Text"},
			{"disp": "SAT_INPUT_03", "obj":"SAT_INPUT_3", "active":false, "type":"Text"},
			{"disp": "SAT_INPUT_04", "obj":"SAT_INPUT_4", "active":false, "type":"Text"},
			{"disp": "SAT_INPUT_05", "obj":"SAT_INPUT_5", "active":false, "type":"Text"},
			{"disp": "SAT_INPUT_06", "obj":"SAT_INPUT_6", "active":false, "type":"Text"},
			{"disp": "SAT_INPUT_07", "obj":"SAT_INPUT_7", "active":false, "type":"Text"},
			{"disp": "SAT_INPUT_08", "obj":"SAT_INPUT_8", "active":false, "type":"Text"},
			{"disp": "SAT_INPUT_09", "obj":"SAT_INPUT_9", "active":false, "type":"Text"},
			{"disp": "SAT_INPUT_10", "obj":"SAT_INPUT_10", "active":false, "type":"Text"},
			{"disp": "SAT_OUTPUT_01", "obj":"SAT_OUTPUT_1", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_02", "obj":"SAT_OUTPUT_2", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_03", "obj":"SAT_OUTPUT_3", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_04", "obj":"SAT_OUTPUT_4", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_05", "obj":"SAT_OUTPUT_5", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_06", "obj":"SAT_OUTPUT_6", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_07", "obj":"SAT_OUTPUT_7", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_08", "obj":"SAT_OUTPUT_8", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_09", "obj":"SAT_OUTPUT_9", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_10", "obj":"SAT_OUTPUT_10", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_11", "obj":"SAT_OUTPUT_11", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_12", "obj":"SAT_OUTPUT_12", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_13", "obj":"SAT_OUTPUT_13", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_14", "obj":"SAT_OUTPUT_14", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_15", "obj":"SAT_OUTPUT_15", "active":false, "type":"Switch"},
			{"disp": "SAT_OUTPUT_16", "obj":"SAT_OUTPUT_16", "active":false, "type":"Switch"}
			];
			
	var satelCfg = {"ip":"0.0.0.0", "port": 8888, "userCode": "1234"};

	$().ready(function(){
		load('controller');
	});
	