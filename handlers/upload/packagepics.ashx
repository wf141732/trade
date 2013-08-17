<%@ WebHandler Language="VB" Class="packagepics" %>

Imports System
Imports System.Web

Public Class packagepics : Implements IHttpHandler
    
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        ' 上传芯片图片
        Dim pid As String = context.Request.QueryString("pn")
        Dim f As HttpPostedFile = context.Request.Files(0)
        Dim url As String = "../../upload/packagephoto/"
        Dim rootPhy As String = context.Request.MapPath(url) ' 物理根目录
        Dim o As New GeneralMethod
        Dim a(0 To 3) As String
        a(0) = pid
        a(1) = Com.GetUserId()
        Dim id As String = o.callProc_with_value(a, "up_package_update_pics")
        o = Nothing
        Dim file As String = rootPhy + id + ".jpg"
        If My.Computer.FileSystem.FileExists(file) Then
            My.Computer.FileSystem.DeleteFile(file)
        End If
        f.SaveAs(file)
        context.Response.ContentType = "text/plain"
        context.Response.Write("success")
    End Sub
 
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class