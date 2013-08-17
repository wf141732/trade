<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.net.URLConnection" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.io.Reader" %>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.net.URL" %>
<%@ page import="java.net.URLConnection" %>
<%@ page import="javax.net.ssl.HostnameVerifier" %>
<%@ page import="javax.net.ssl.HttpsURLConnection" %>
<%@ page import="javax.net.ssl.SSLContext" %>
<%@ page import="javax.net.ssl.SSLSession" %>
<%@ page import="javax.net.ssl.TrustManager" %>
<%@ page import="javax.net.ssl.X509TrustManager" %>
<%@ page import="java.security.cert.X509Certificate" %>

<%@include file="env.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<%
String code=request.getParameter("code");

TrustManager[] trustAllCerts = new TrustManager[] {
   new X509TrustManager() {
      public java.security.cert.X509Certificate[] getAcceptedIssuers() {
        return null;
      }

      public void checkClientTrusted(X509Certificate[] certs, String authType) {  }

      public void checkServerTrusted(X509Certificate[] certs, String authType) {  }

   }
};

SSLContext sc = SSLContext.getInstance("SSL");
sc.init(null, trustAllCerts, new java.security.SecureRandom());
HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

// Create all-trusting host name verifier
HostnameVerifier allHostsValid = new HostnameVerifier() {
    public boolean verify(String hostname, SSLSession session) {
      return true;
    }
};
// Install the all-trusting host verifier
HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);

URL url = new URL("https://oauth.taobao.com/token?grant_type=authorization_code&client_id="+appkey+"&client_secret="+appsecret+"&code="+code+"&redirect_uri="+redirectUrlPrefix);
HttpsURLConnection httpsURLConnection=(HttpsURLConnection)url.openConnection();
httpsURLConnection.setConnectTimeout(30000);
httpsURLConnection.setReadTimeout(30000);
httpsURLConnection.setDoOutput(true);
httpsURLConnection.setDoInput(true); 
httpsURLConnection.setUseCaches(false);   
httpsURLConnection.setRequestMethod("POST");

httpsURLConnection.connect();

int responseCode=httpsURLConnection.getResponseCode();
InputStream input=null;
if(responseCode==200){
	input=httpsURLConnection.getInputStream();
}else{
	input=httpsURLConnection.getErrorStream();
}
BufferedReader in = new BufferedReader(new InputStreamReader(input));
StringBuilder result=new StringBuilder();
String line=null; 
while((line=in.readLine())!=null){
	result.append(line);
}

out.println(result.toString());
%>

</body>
</html>