<%@ WebHandler Language="VB" Class="cus_logo" %>

Imports System
Imports System.Web
Imports gVar
Public Class cus_logo : Implements IHttpHandler
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        ' 上传芯片图片
        Dim cusid As String = context.Request.Form("cusid")
        Dim f As HttpPostedFile = context.Request.Files("Filedata")
        Dim url As String = "../../upload/customerlogo/"
        Dim rootPhy As String = context.Request.MapPath(url) ' 物理根目录
        Dim aStr() As String = Split(f.FileName, ".")
        Dim sExtend As String = aStr(aStr.GetUpperBound(0)) ' file extend
        Dim file As String = rootPhy + cusid + "." + sExtend
        If My.Computer.FileSystem.FileExists(file) Then
            My.Computer.FileSystem.DeleteFile(file)
        End If
        f.SaveAs(file)

        Dim sp As New aac.SqlProcedure("up_co_uploadlogo")
        Dim a(0 To 1) As String
        a(0) = cusid
        a(1) = sExtend
        sp.callPro(a)
        sp = Nothing
        
        
        context.Response.ContentType = "text/plain"
        context.Response.Write(sExtend)
    End Sub
 
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class