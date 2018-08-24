App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:9545',
  chairPerson:null,
  currentAccount:null,
  init: function() {
     return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('bet.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var betArtifact = data;
    App.contracts.bet = TruffleContract(betArtifact);

    // Set the provider for our contract
    App.contracts.bet.setProvider(App.web3Provider);
    
   
    return App.bindEvents();
  });
  },

  bindEvents: function() {
    $(document).on('click', '#register', function(){ var ad = $('#registerAddress').val(); 
    App.handleRegister(ad); $('#registerAddress').val('');  });

    $(document).on('click', '#betButton', function(){ var amount = $('#betAmount').val(); 
    App.handleBet(amount); $('#betAmount').val('');  });

    $(document).on('click', '#declareWinner', function(){App.handleWinner();});

    
  },

  populateAddress : function(){
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts,function(i){
        if(web3.eth.coinbase != accounts[i]){
          var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#registerAddress').append(optionElement);  
        }
      });
    });
  },

 

  handleRegister: function(addr){

    var betInstance;
    App.contracts.bet.deployed().then(function(instance) {
      betInstance = instance;
      return betInstance.register(addr);
    }).then( function(result){
      if(result.receipt.status == '0x01')
        alert(addr + " is registered successfully")
      else
        alert(addr + " account registeration failed due to revert")
    }).catch( function(err){
      alert(addr + " account registeration failed")
    })
  },

  handleBet: function(betAmount){

    var betInstance;
    App.contracts.bet.deployed().then(function(instance) {
      betInstance = instance;
      return betInstance.gamble(betAmount);
    }).then( function(result){
      if(result.receipt.status == '0x01')
        alert(betAmount + " gambled successfully")
      else
        alert(betAmount + " could not be gambled due to revert")
    }).catch( function(err){
      alert(betAmount + " could not be gambled")
    })
  },

  handleWinner : function() {
    var betInstance;
    App.contracts.bet.deployed().then(function(instance) {
      betInstance = instance;
      return betInstance.declareWinner();
    }).then(function(res){
      alert(res + "  is the winner ! :)");
    }).catch(function(err){
      console.log(err.message);
    })
  }
};


$(function() {
  $(window).load(function() {
    App.init();
    console.log('starting app.js');
  });
});
