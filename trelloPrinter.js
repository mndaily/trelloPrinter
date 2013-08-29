/* 
NOTE: The Trello client library has been included as a Managed Resource.  To include the client library in your own code, you would include jQuery and then

<script src="https://api.trello.com/1/client.js?key=your_application_key">...

See https://trello.com/docs for a list of available API URLs

The API development board is at https://trello.com/api

The &dummy=.js part of the managed resource URL is required per http://doc.jsfiddle.net/basic/introduction.html#add-resources
*/

var dimsCardPrototype = $('<tr></tr>',{
    class: 'card'
}).append(
    $('<td></td>',{class:['slug']}),
    $('<td></td>',{class:'due'}),
    $('<td></td>',{class:'headline'}),
    $('<td></td>',{class:'summary'}),
    $('<td></td>',{class:'reporters'}),
    $('<td></td>',{class:'desk'}),
    $('<td></td>',{class:'inches'})
)

var authorizeTrello = function(){
    Trello.authorize({
        interactive:true,
        name: 'TrelloPrinter',
        scope: {'read':'allowRead','account':'allowAccount'},
        success: onAuthorize
    }); 
}

var onAuthorize = function() {
    updateLoggedIn();
    var dimsBoard = 'DIMS Experiment MT'
    var dimsBoardId = -1
    
    Trello.members.get("me", function(member){
        $("#fullName").text(member.fullName);
        Trello.get("members/me/boards/", function(boards) {
            $.each(boards, function(ix, board) {
                if(board.name == dimsBoard){
                    console.log("DIMS board is "+board.id)
                    dimsBoardId = board.id
                }
            });
            if(dimsBoardId == -1){
                alert('No Dims board')
                $('#outputTable').empty()
            }
            else{
                Trello.get("boards/"+dimsBoardId+"/cards/",{ fields : ['name','labels','desc','due'], members: true, member_fields : ['fullName'] }, function(cards){
                    $.each(cards, fillCard)
                },
                function(error){
                    alert("Error!")
                })
            }
        });

    });

};

var updateLoggedIn = function() {
    var isLoggedIn = Trello.authorized();
    $("#loggedout").toggle(!isLoggedIn);
    $("#loggedin").toggle(isLoggedIn);        
};
    
var logout = function() {
    Trello.deauthorize();
    updateLoggedIn();
};

var fillCard = function(ix, card){
    var dimsCard = $(dimsCardPrototype).clone()
    
    var cardName = card.name
    var deskEx = /\[.*\]/
    var desk = cardName.match(deskEx)
    if(desk != null){
    	desk = desk.toString()
    	cardName = cardName.replace(desk,'')
    	desk = desk.replace('[','').replace(']','')
    }
    
    var cardDescription = card.desc
    var headlineText = null
    var headlineEx = /#.*/
    var headline = cardDescription.match(headlineEx)
    //remove the headline from the description, remove the hash from the headline
    if(headline != null){
        headline = headline.toString()
        cardDescription = cardDescription.replace(headline,'')
        headlineText = headline.toString().replace('#','')
    }

    var numInches = null
    var inchesEx = /`{3}.*\d+.*`{3}/
    //match number and other stuff in backticks
    var inches = card.desc.match(inchesEx)
    //Remove stuff in backticks from the description, get the inch count from the backticks
    if(inches != null){
        inches = inches.toString()
        cardDescription = cardDescription.replace(inches,'')
        var inchNumEx = /\d+/
        inches = inches.toString().match(inchNumEx)
        if(inches != null){
            numInches = inches.toString()
        }
    }
    
    var members = card.members
    var memberNames = ''
    for(i=0; i < members.length; i++){
    	if(i == members.length -1){
    		memberNames+= members[i].fullName
    	}
    	else{
    		memberNames+= members[i].fullName + "<br>"
    	}
    }

    //console.log('headline: '+headlineText+'\ninches: '+numInches+'\n:description: '+cardDescription)
    console.log('card: '+JSON.stringify(card))
    dueDate = new Date(card.due)
    $(dimsCard).children('.slug').append(cardName)
    $(dimsCard).children('.due').append(dueDate.toDateString())
    $(dimsCard).children('.headline').append(headlineText)
    $(dimsCard).children('.summary').append(cardDescription)
    $(dimsCard).children('.reporters').append(memberNames)
    $(dimsCard).children('.desk').append(desk)
    $(dimsCard).children('.inches').append(numInches)
    $('#outputTable').append(dimsCard)
}
                          
jQuery('document').ready(function(){
    authorizeTrello()
    $("#disconnect").click(logout);
    $("#connectLink").click(function(){
        authorizeTrello()
    });
})