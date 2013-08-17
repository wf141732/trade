<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@ page import="com.taobao.top.syncserver.service.impl.DefaultConfigServiceImpl" %>
<%@ page import="com.taobao.top.syncserver.util.Constant" %>
<%
String contextPath=request.getContextPath();
DefaultConfigServiceImpl config1=new DefaultConfigServiceImpl();
String urlPrefix= config1.getConfig(Constant.SYN_REDIRECT_URL_PREFIX);
String appkey=config1.getConfig(Constant.APP_KEY);
//String appSec=config1.getConfig(Constant.APP_SECRET);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<body>
<h2><a target="_blank" href="https://oauth.taobao.com/authorize?response_type=code&client_id=<%=appkey%>&redirect_uri=<%=urlPrefix%><%=contextPath %>/UserInfo">OAuth2.0 Server-side flow Sample</a></h2>
<h2><a target="_blank" href="https://oauth.taobao.com/authorize?response_type=token&client_id=<%=appkey%>&redirect_uri=<%=urlPrefix%><%=contextPath %>/UserInfo">OAuth2.0 Client-side flow Sample</a></h2>
<h2><a target="_blank" href="https://oauth.taobao.com/authorize?response_type=code&client_id=<%=appkey%>&redirect_uri=urn:ietf:wg:oauth:2.0:oob">OAuth2.0 Native Application Sample</a></h2>
</body>
</html>
<<script type="text/javascript">
var pp=function(){
	alert(1);
}
</script>
