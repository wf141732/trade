Imports Microsoft.VisualBasic
Imports System.Data.SqlClient
Imports System.IO
Imports System.Web.UI.Page

Public Class ChatGroups
    Public groups() As ChatGroup
End Class
'groupid,friendId,friname,��Ƭ,��˾��,����

Public Class DigPnUpload
    Public data As String
    Public uid As String
    Public GetCount As String
    Public State As String
    Public WebId As String ' robot.web ID
    Public PnId As String ' robot.pn ID
    Public StartTime As String
    Public TotalPage As String
    Public TotalCount As String
    Public EndTime As String
End Class

Public Class DigCompany
    Public i As String
    Public n As String
End Class

Public Class DigCompanyWithShort
    Public i As String
    Public n As String
    Public s As String
End Class

Public Class ChatFriend
    Public id As String
    Public name As String
    Public groupid As String
    Public pic As String
    Public company As String
    Public isOnline As String
End Class

Public Class u_common_item
    Public id As String
    Public value As String
End Class

Public Class MyShipSets
    Public shipFrom() As u_common_item
    Public shipTo() As u_common_item
    Public express() As u_common_item
End Class


Public Class ChatGroup
    Public id As String
    Public name As String
    Public frieds() As ChatFriend
End Class

Public Class ShipUpdatePart
    Public id As String
    Public saleId As String '��ID �Ӷ���ҳ�洫����
    Public qty As String '����
End Class

Public Class ShipUpdate
    Public id As String
    Public fromId As String '�ҵ�λ��
    Public toId As String '����Ŀ�ĵ�
    Public ExpressID As String '��ݹ�˾
    Public Tracking As String '��ݸ��ٺ�
    Public comment As String '��ע
    Public uId As String
    Public aPn() As ShipUpdatePart '�������ͺ�
End Class

Public Class PoPn
    Public id As String
    Public pn As String '�ͺ�
    Public qty As String '����
    Public price As String '����
End Class

Public Class ShipViewSinglePart
    Public shipId As String
    Public shipFrom As String '�ͺ�
    Public shipTo As String '����
    Public shipDate As String ' ��������
    Public express As String '��ݹ�˾
    Public comment As String '��ע
    Public Tracking As String '���ٺ�
End Class

Public Class PoProgress ' ��������
    Public id As String
    Public saleId As String '��ID
    Public body As String '��������
    Public pDate As String '��������
    Public uID As String '����ID
    Public author As String ' ����
End Class

Public Class PoChaHuo
    Public id As String
    Public result As String
    Public pn As String
    Public comment As String
    Public author As String
    Public uid As String
    Public sDate As String
End Class

Public Class PoPic ' ����ͼƬ
    Public id As String
    Public pn As String '�ͺ�
    Public file As String ' �ļ��� ������·��
    Public comment As String '��ע
    Public clss As String '����
    Public sDate As String '����
    Public author As String '����
    Public pnId As String '�ͺ�ID
End Class


Public Class InstockInUpdate
    '@ID int,
    '@��ID int,
    '@��˾ID int,
    '@uID int,
    '@coId int,
    '@������ID int,
    '@���� int,--������:��� ������:����
    '@���� smallmoney,
    '@ʵ�� money,
    '@���� varchar(50),
    '@�ͺ����� varchar(50),
    '@��ע varchar(100)
    Public a(0 To 11) As String ' ���������Ϣ
    Public b() As InstockInUpdateXhDetail '���������ϸ
End Class


Public Class InstockInUpdateXhDetail
    Public id As String 'f.��_�������� ID >0 Ϊ�޸� <0 Ϊ���
    Public xhId As String '���ID
    Public qty As String '���� Ϊ�� ���Ϊ��
End Class



'id,�ͺ�,����,˵��,����,����,uID
'ID,�ͺ�,�ļ���,����,����ID,����,����,����,�ͺ�ID
Public Class PoInfoFull
    Public id As String ' poid
    Public customer As String '�ͻ�
    Public cusomerId As String '�ͻ�ID
    Public contact As String '��ϵ��
    Public contactId As String '��ϵ��ID
    Public amount As String ' ���
    'Public state As String '״̬

    Public stateDesc As String '״̬����
    Public comment As String ' ��ע
    Public poDate As String ' ��������
    Public aPn() As PoPn '�ö��������ͺ��б�
    Public aShip() As ShipViewSinglePart
    Public aChahuo() As PoChaHuo ' ��� ƴ��
    Public aProgress() As PoProgress '����
    Public aPic() As PoPic 'ͼƬ
End Class

Public Class Com
    Public Shared Function GetConnectStr() As String
        Return ConfigurationManager.ConnectionStrings("crmnewConnectionString").ToString
    End Function

    Public Shared Function GetConnectStr_livepn() As String
        Return ConfigurationManager.ConnectionStrings("crmnewConnectionString_livepn").ToString
    End Function

    Public Shared Function GetConnectStr_mail() As String
        Return ConfigurationManager.ConnectionStrings("crmnewConnectionString_mail").ToString
    End Function

    Public Shared Function GetConnectStr_stock() As String
        Return ConfigurationManager.ConnectionStrings("crmnewConnectionString_stock").ToString
    End Function

    Public Shared Function GetConnectStr_static() As String ' ��ѯ������
        Return ConfigurationManager.ConnectionStrings("crmnewConnectionString_qs").ToString
    End Function

    ''' <summary>
    ''' ��ȡ�ļ���չ��
    ''' </summary>
    ''' <param name="fileName"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetFileExt(ByVal fileName As String) As String
        Dim a() As String = Split(fileName, ".")
        Return a(a.GetUpperBound(0))
    End Function
    ''' <summary>
    ''' ʹ�ַ�������sql����׼��' replace by ''  "," replace by
    ''' </summary>
    ''' <param name="sSource"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function ValidStrForSql(ByVal sSource As String) As String
        If String.IsNullOrEmpty(sSource) Then
            Return sSource
        Else
            sSource = Regex.Replace(sSource, "%", "")
            sSource = Regex.Replace(sSource, "'", "''")
            Return sSource
        End If
    End Function

    Private Sub gLog(ByVal type As String, ByVal desc As String, ByVal userId As String)
        Dim sql As String = "insert into ��־(�û�ID,PcId,����,����)values({0})"
        Dim a(0 To 3) As String
        a(0) = userId
        a(1) = "'" + GetClientIP() + "'"
        a(2) = "'" + desc + "'"
        a(3) = type
        Com.ExecuteSql(String.Format(sql, Join(a, ",")))
    End Sub

    Private Function GetClientIP() As String
        Dim result As String = HttpContext.Current.Request.ServerVariables("HTTP_X_FORWARDED_FOR")

        If String.IsNullOrEmpty(result) Then
            result = HttpContext.Current.Request.ServerVariables("REMOTE_ADDR")
        End If
        If String.IsNullOrEmpty(result) Then
            result = HttpContext.Current.Request.UserHostAddress
        End If
        Return result
    End Function

    Public Shared Function GetUserId() As String
        Try
            Return HttpContext.Current.Request.Cookies("userid").Value
        Catch ex As Exception
            Return "0"
        End Try
    End Function

    Public Shared Function GetCompanyId() As String
        Return HttpContext.Current.Request.Cookies("companyid").Value
    End Function


    ''' <summary>
    ''' �ж�sMother ���Ƿ��� sTarget ���ִ�Сд,sMother�Զ��ŷָ�,�ҵ�ƥ�䷵�ص�һ��ƥ���λ�ã����򷵻�-1
    ''' </summary>
    ''' <param name="sTarget"></param>
    ''' <param name="sMother"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function HaveString(ByVal sTarget As String, ByVal sMother As String) As Integer
        Dim aStr() As String
        Dim i#
        HaveString = -1
        If Len(sMother) > 0 Then
            aStr = Split(sMother, ",")
            For i = 0 To UBound(aStr)
                If StrComp(sTarget, aStr(i), vbTextCompare) = 0 Then
                    HaveString = i
                    Exit For
                End If
            Next i
        End If
    End Function


    ''' <summary>
    ''' ���ش����ɾ��ָ������ʣ�µ��ַ���
    ''' </summary>
    ''' <param name="sSource"></param>
    ''' <param name="delChars"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function delLastLetters(ByVal sSource As String, ByVal delChars As String) As String
        If Not String.IsNullOrEmpty(sSource) Then
            If sSource.EndsWith(delChars) Then
                sSource = sSource.Substring(0, Len(sSource) - Len(delChars))
            End If
        End If
        Return sSource
    End Function


    Public Shared Function ExecuteSql(ByVal sSql As String, Optional ByVal isReturnScalar As Boolean = False, Optional ByVal constr As String = "") As String
        If String.IsNullOrEmpty(constr) Then constr = GetConnectStr()
        Dim cn As New SqlConnection(constr)
        cn.Open()
        Dim cmd As New SqlCommand(sSql, cn)
        cmd.CommandTimeout = 500
        Dim s As String = ""
        Try
            If isReturnScalar Then
                Dim dr As SqlDataReader = cmd.ExecuteReader
                If dr.Read Then s = dr(0).ToString
                dr.Close()
            Else
                cmd.ExecuteNonQuery()
                s = "success"
            End If
        Catch ex As Exception
            If sSql.Length > 400 Then sSql = ex.Message
            errProccss(sSql, "ExecuteSql")
            s = ex.Message
        End Try
        cmd.Dispose()
        cn.Dispose()
        Return s
    End Function


    ''' <summary>
    ''' ��¼�³������д�����ϸ��Ϣ
    ''' </summary>
    ''' <param name="errMsg">������Ϣ����Ҫ��sql���</param>
    ''' <param name="source">����Դ�������Ƿ�������ĺ��������̡���</param>
    ''' <remarks></remarks>
    Public Shared Sub errProccss(ByVal errMsg As String, ByVal source As String)
        errMsg = Com.ValidStrForSql(errMsg)
        Dim uId As String = GetUserId()
        If String.IsNullOrEmpty(uId) Then uId = "-1"
        Dim sql As String = "insert into ���󱨸�(����,��Դ,uID)values('{0}','{1}','" + uId + "')"
        sql = String.Format(sql, errMsg, source)
        Dim cn As New SqlConnection(GetConnectStr)
        cn.Open()
        Dim cmd As New SqlCommand(sql, cn)
        Try
            cmd.ExecuteNonQuery()
        Catch ex As Exception
        End Try
        cmd.Dispose()
        cn.Dispose()
    End Sub
End Class
