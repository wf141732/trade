<!DOCTYPE html>
<html lang="en">
<head>  
 <title>top!</title>  
 <script>
 if("${error}")
 {
 alert("${error}")
 }
 else{
 window.opener.postMessage({"uid${openerFun?default("")}":"${Nick}"},"*");
 }
 window.close();
 </script>
 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
</head>  
<body>        
</body>     
</html>  