pragma solidity ^0.4.0;

contract bet{
    struct Gambler{
        address gamblerAddress;
        uint    betAmount;
        bool    alreadyRegistered;
        bool    alreadybet;
    }
    
    address winnerAddress;
    
    address ownerAddress;
    
    mapping (address => Gambler) gamblers;
    
    Gambler[] registeredGamblers;
    
    modifier onlyOwner {
        require(msg.sender == ownerAddress);
        _;
    }
    
    function bet() public {
        ownerAddress = msg.sender;
    }
    
    function register(address _gamblerAddress) public  onlyOwner{
        if(gamblers[_gamblerAddress].alreadyRegistered == true) revert();
        var gambler = gamblers[_gamblerAddress];
        gambler.alreadyRegistered = true;
        gambler.alreadybet = false;
        gambler.gamblerAddress = _gamblerAddress;
        //registeredGamblers.push(gamblers[_gamblerAddress]);
    }
    
    function gamble(uint _betAmount) public {
        if(gamblers[msg.sender].alreadybet == true || gamblers[msg.sender].alreadyRegistered != true) revert();
        var gambler = gamblers[msg.sender];
        gambler.alreadybet = true;
        gambler.betAmount = _betAmount;
        registeredGamblers.push(gambler);
       
    }
    
    function declareWinner() public constant returns (address) {
        uint highestBetAmount = registeredGamblers[0].betAmount;
        winnerAddress = registeredGamblers[0].gamblerAddress;
        for(uint i=0;i<registeredGamblers.length;i++){
            if(registeredGamblers[i].betAmount>highestBetAmount){
                highestBetAmount = registeredGamblers[i].betAmount;
                winnerAddress = registeredGamblers[i].gamblerAddress;
            }
        }
        
        return(winnerAddress);
    }
}