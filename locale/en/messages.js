module.exports={languageData:{"plurals":function(n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}},messages:{"<0>Click here</0> if you want to see nothing <1/>and <2>click here</2> to visit this demo's project page.":"<0>Click here</0> if you want to see nothing <1/>and <2>click here</2> to visit this demo's project page.","Smola's React Professional Development Project":"Smola's React Professional Development Project","What is it about <0>GitHub</0>? Do you {emotion} it?":function(a){return["What is it about <0>GitHub</0>? Do you ",a("emotion")," it?"]},"{count, plural, one {I can think of at least # thing, ${name}} other {I can think of at least <0>#</0> things, {name}}}":function(a){return[a("count","plural",{one:["I can think of at least ","#"," thing, $",a("name")],other:["I can think of at least <0>","#","</0> things, ",a("name")]})]},"Have you read {gender, select, male {his} female {her} other {their}} book?":function(a){return["Have you read ",a("gender","select",{male:"his",female:"her",other:"their"})," book?"]},"I came in {count, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} place.":function(a){return["I came in ",a("count","selectordinal",{one:["#","st"],two:["#","nd"],few:["#","rd"],other:["#","th"]})," place."]},"{0, plural, =0 {There are no problems.} one {There is # problem.} other {There are # problems.}}":function(a){return[a("0","plural",{0:"There are no problems.",one:["There is ","#"," problem."],other:["There are ","#"," problems."]})]},"Harnessing Growth Energy":"Harnessing Growth Energy","Here's a new Date object: {0,date}":function(a){return["Here's a new Date object: ",a("0","date")]},"add_a_member_to_your_organization":"Add a member to your organization.","remove_user_from_champion":function(a){return["Remove ",a("user")," from ",a("champion"),"?"]}}};