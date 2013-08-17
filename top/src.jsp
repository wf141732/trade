<%@ page language="java" contentType="text/javascript; charset=UTF-8"
    pageEncoding="UTF-8"%><%@ page import="com.taobao.top.syncserver.service.impl.DefaultConfigServiceImpl" 
    %><%@ page import="com.taobao.top.syncserver.util.Constant" %><%
String contextPath=request.getContextPath();
DefaultConfigServiceImpl config1=new DefaultConfigServiceImpl();
String urlPrefix= config1.getConfig(Constant.SYN_REDIRECT_URL_PREFIX);
String appkey=config1.getConfig(Constant.APP_KEY);
String callback=request.getParameter("callback");
%><%=callback%>("https://oauth.taobao.com/authorize?response_type=code&client_id=<%=appkey%>&redirect_uri=<%=urlPrefix%><%=contextPath %>/UserInfo");

