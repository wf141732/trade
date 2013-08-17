<%@ WebHandler Language="VB" Class="bbsatt" %>

Imports System
Imports System.Web
Imports gVar
Imports AacImageResize

Public Class bbsatt : Implements IHttpHandler
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        ' 上传芯片图片
        Dim ids As String = context.Request.QueryString("id")
        Dim a() As String = Split(ids, splt1)
        Dim topicid As String = a(0)
        Dim replyid As String = a(1)
        Dim f As HttpPostedFile = context.Request.Files(0)
        Dim root As String = "~/upload/bbsatt/" + replyid + "/"
        Dim rootPhy As String = context.Request.MapPath(root) ' 物理根目录
        ' 添加到数据库中去
        Dim sFileName As String = (f.FileName)
        Dim b(0 To 2) As String
        b(0) = topicid
        b(1) = replyid
        b(2) = sFileName
        Dim rs As aac.SqlResult = callProc(b, "up_bbs_add_attach")
        If Not My.Computer.FileSystem.DirectoryExists(rootPhy) Then ' create directory if folder not exist
            My.Computer.FileSystem.CreateDirectory(rootPhy)
        End If
        f.SaveAs(rootPhy + sFileName)
        ' 显示刚上传的图片
        context.Response.ContentType = "text/plain"
        context.Response.Write(sFileName)
    End Sub
 
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property


    Private Function callProc(ByVal aPara() As String, ByVal pName As String) As aac.SqlResult
        Dim p As New aac.SqlProcedure(pName)
        Dim rs As aac.SqlResult = p.callPro(aPara)
        p = Nothing
        Return rs
    End Function
End Class