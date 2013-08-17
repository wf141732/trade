<%@page import="com.aac.top.RefreshToken"%>
<%@page import="com.aac.base.TradeConstant"%>
<%@page import="com.aac.base.FileDB2"%>
<%@page import="com.aac.top.OauthTokenResponse"%>
<%@page import="com.aac.top.UserInfo"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.Set"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	<%
		if (request.getParameter("rmcs") != null
				&& !request.getParameter("rmcs").isEmpty()) {
			String id = "I_263664221";
			OauthTokenResponse user = UserInfo.USERS.get(id);
			UserInfo.USERS.remove(id);
			UserInfo.USERS.remove("S_" + user.getAccessToken());
			UserInfo.USERS.remove("N_" + user.getTaobaoUserNick());
		}

		if (request.getParameter("rt") != null
				&& !request.getParameter("rt").isEmpty()) {
			RefreshToken rToken = new RefreshToken();

			Set<String> set = UserInfo.USERS.keySet();
			Iterator<?> it = set.iterator();
			out.println(set.size());
			java.util.List<String> ids = new java.util.ArrayList<String>();
			while (it.hasNext()) {
				String key = (String) it.next();

				if (key.indexOf("I") == 0) {
					ids.add(key);
				}
			}
			for (int i = 0; i < ids.size(); i++) {
				String key = ids.get(i);
				out.println("key:"+key);
				OauthTokenResponse userReq = UserInfo.USERS.get(key);
				out.println(userReq.getAccessToken());
				out.println(userReq.getRefreshToken());
				//if(System.currentTimeMillis()- userReq.getLastSessionTime()>1L*3600L*1000L)
				if (1 == 1) {
					OauthTokenResponse userResp = rToken
							.StartOneRefresh(userReq);
					out.println("userResp:"+userResp.getBody());
					out.println(userResp.getAccessToken());
					out.println(userResp.getTaobaoUserId());
					out.println(userResp.getTaobaoUserNick());
					out.println(userResp);
					if (userResp != null) {
						userResp.setLastSessionTime(System
								.currentTimeMillis());
						UserInfo.USERS.remove("S_"
								+ userReq.getAccessToken());
						UserInfo.USERS.put("I_"
								+ userReq.getTaobaoUserId().toString(),
								userResp);
						UserInfo.USERS.put(
								"N_" + userReq.getTaobaoUserNick(),
								userResp);
						UserInfo.USERS.put("S_" + userReq.getAccessToken(),
								userResp);

					}
				}

			}
		}

		if (request.getParameter("rmid") != null
				&& !request.getParameter("rmid").isEmpty()) {
			String id = request.getParameter("rmid");
			UserInfo.USERS.remove(id);
		}

		Set<String> set = UserInfo.USERS.keySet();
		Iterator<?> it = set.iterator();
		while (it.hasNext()) {
			String key = (String) it.next();
			out.println(key + " "
					+ UserInfo.USERS.get(key).getTaobaoUserNick() + "<br/>");
		}

		if (request.getParameter("svfile") != null
				&& !request.getParameter("svfile").isEmpty()) {
			FileDB2 db = new FileDB2(TradeConstant.FILE_TOP_USER_TABLE,
					getServletConfig().getServletContext());
			db.update(TradeConstant.FILE_TOP_USER_KEY, UserInfo.USERS);
		}
	%>
</body>
</html>