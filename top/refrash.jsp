<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.aac.top.*" %>
<%@ page import="java.util.Set" %>
<%@ page import="java.util.Iterator" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	<%
	RefreshToken rToken = new RefreshToken();
	Set<String> set = UserInfo.USERS.keySet();
	Iterator<?> it = set.iterator();
	java.util.List<String> ids = new java.util.ArrayList<String>();
	while (it.hasNext()) {
		String key = (String) it.next();

		if (key.indexOf("I") == 0) {
			ids.add(key);
		}
	}
	for (int i = 0; i < ids.size(); i++) {
		String key = ids.get(i);
		out.print(i);
		out.print(key+'-');
		OauthTokenResponse user = UserInfo.USERS.get(key);
		out.print(userReq.getTaobaoUserId()+'-');
		if (System.currentTimeMillis() - userReq.getLastSessionTime() > 1L * 3600L * 1000L) {
			OauthTokenResponse userResp=null;
			try{
			userResp = rToken
					.StartOneRefresh(userReq);}
			catch(Exception e)
			{
				out.print(e.toString());
			}
			if (userResp != null) {
				userResp.setLastSessionTime(System.currentTimeMillis());
				UserInfo.USERS.remove("S_" + userReq.getAccessToken());						
				UserInfo.USERS.put("I_"
						+ userReq.getTaobaoUserId().toString(),
						userResp);
				UserInfo.USERS.put("N_" + userReq.getTaobaoUserNick(),
						userResp);
				UserInfo.USERS.put("S_" + userReq.getAccessToken(),
						userResp);

			}
		}
	}
	%>
</body>
</html>