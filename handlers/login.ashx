<%@ WebHandler Language="VB" Class="login" %>

Imports System
Imports System.Web
Imports System.Data
Public Class login : Implements IHttpHandler
    Public Const splt1 As String = "|~"
    Public Const splt2 As String = "-.-"
    Public Const splt3 As String = "^^"
    Public Const splt4 As String = "~.~"
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        Dim userIP As String = context.Request.ServerVariables("HTTP_X_FORWARDED_FOR")
        If String.IsNullOrEmpty(userIP) Then
            userIP = context.Request.ServerVariables("REMOTE_ADDR")
        End If

        Dim a(0 To 2) As String
        a(0) = context.Request.QueryString("user")
        a(1) = context.Request.QueryString("psw")
        If a(0) Is Nothing Then
            a(0) = context.Request.Form("user")
            a(1) = context.Request.Form("psw")
        End If
        a(2) = userIP
        'ID,公司ID,TrueName,角色ID,角色名,公司名,平台ID,默认货币,公司默认平台,询价提示,平台数,@平台,PingTaiLock,箱号ID,货位管理
        Dim s As String = callPro_with_data(a, "up_member_login")
        context.Response.ContentType = "text/plain"
        context.Response.Write(s)
    End Sub

    Public Function callPro_with_data(ByVal aPara() As String, ByVal pName As String) As String
        Dim p As New aac.SqlProcedure(pName, True, get_constr_type(1))
        Dim rs As aac.SqlResult = p.callPro(aPara)
        Dim s As String = ""
        Try
            s = dt2Str(rs.dt)
        Catch ex As Exception
            Com.errProccss(ex.Message, "callPro_with_data")
        End Try
        p = Nothing
        rs = Nothing
        Return s
    End Function

    Public Function dt2Str(ByRef dt As DataTable) As String
        '读取 SqlDataReader 转化成字符串
        Dim fCount As Integer = dt.Columns.Count
        Dim sb As New StringBuilder(1000)
        For i As Integer = 0 To dt.Rows.Count - 1
            For j As Integer = 0 To fCount - 2
                sb.Append(dt.Rows(i).Item(j).ToString + splt1)
            Next
            sb.Append(dt.Rows(i).Item(fCount - 1).ToString + splt2)
        Next
        Dim s As String = Com.delLastLetters(sb.ToString(), splt2)
        sb = Nothing
        Return s
    End Function
    
    Private Function get_constr_type(ByVal type As Integer) As String
        ' 根据类型获取连接字符串
        Dim str_con As String
        If type = 1 Then
            str_con = Com.GetConnectStr
        ElseIf type = 2 Then ' livepn
            str_con = Com.GetConnectStr_livepn
        ElseIf type = 3 Then '邮件
            str_con = Com.GetConnectStr_mail
        ElseIf type = 4 Then '库存
            str_con = Com.GetConnectStr_stock
        Else
            str_con = ""
        End If
        Return str_con
    End Function
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class