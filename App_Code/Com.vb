Imports Microsoft.VisualBasic
Imports System.Data.SqlClient
Imports System.IO
Imports System.Web.UI.Page

Public Class ChatGroups
    Public groups() As ChatGroup
End Class
'groupid,friendId,friname,照片,公司名,在线

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
    Public saleId As String '销ID 从订单页面传过来
    Public qty As String '数量
End Class

Public Class ShipUpdate
    Public id As String
    Public fromId As String '我的位置
    Public toId As String '发往目的地
    Public ExpressID As String '快递公司
    Public Tracking As String '快递跟踪号
    Public comment As String '备注
    Public uId As String
    Public aPn() As ShipUpdatePart '该批次型号
End Class

Public Class PoPn
    Public id As String
    Public pn As String '型号
    Public qty As String '数量
    Public price As String '单价
End Class

Public Class ShipViewSinglePart
    Public shipId As String
    Public shipFrom As String '型号
    Public shipTo As String '数量
    Public shipDate As String ' 发货日期
    Public express As String '快递公司
    Public comment As String '备注
    Public Tracking As String '跟踪号
End Class

Public Class PoProgress ' 订单进度
    Public id As String
    Public saleId As String '销ID
    Public body As String '进度内容
    Public pDate As String '进度日期
    Public uID As String '作者ID
    Public author As String ' 作者
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

Public Class PoPic ' 订单图片
    Public id As String
    Public pn As String '型号
    Public file As String ' 文件名 不包含路径
    Public comment As String '备注
    Public clss As String '分类
    Public sDate As String '日期
    Public author As String '作者
    Public pnId As String '型号ID
End Class


Public Class InstockInUpdate
    '@ID int,
    '@存ID int,
    '@公司ID int,
    '@uID int,
    '@coId int,
    '@经办人ID int,
    '@数量 int,--正数量:入库 负数量:出库
    '@单价 smallmoney,
    '@实付 money,
    '@单据 varchar(50),
    '@型号描述 varchar(50),
    '@备注 varchar(100)
    Public a(0 To 11) As String ' 基本入库信息
    Public b() As InstockInUpdateXhDetail '出库箱号明细
End Class


Public Class InstockInUpdateXhDetail
    Public id As String 'f.存_出入库箱号 ID >0 为修改 <0 为添加
    Public xhId As String '箱号ID
    Public qty As String '出货 为负 入库为正
End Class



'id,型号,结论,说明,作者,日期,uID
'ID,型号,文件名,描述,分类ID,分类,日期,作者,型号ID
Public Class PoInfoFull
    Public id As String ' poid
    Public customer As String '客户
    Public cusomerId As String '客户ID
    Public contact As String '联系人
    Public contactId As String '联系人ID
    Public amount As String ' 金额
    'Public state As String '状态

    Public stateDesc As String '状态描述
    Public comment As String ' 备注
    Public poDate As String ' 订单日期
    Public aPn() As PoPn '该订单所有型号列表
    Public aShip() As ShipViewSinglePart
    Public aChahuo() As PoChaHuo ' 查货 拼音
    Public aProgress() As PoProgress '进度
    Public aPic() As PoPic '图片
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

    Public Shared Function GetConnectStr_static() As String ' 查询服务器
        Return ConfigurationManager.ConnectionStrings("crmnewConnectionString_qs").ToString
    End Function

    ''' <summary>
    ''' 获取文件扩展名
    ''' </summary>
    ''' <param name="fileName"></param>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Shared Function GetFileExt(ByVal fileName As String) As String
        Dim a() As String = Split(fileName, ".")
        Return a(a.GetUpperBound(0))
    End Function
    ''' <summary>
    ''' 使字符串符合sql语句标准，' replace by ''  "," replace by
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
        Dim sql As String = "insert into 日志(用户ID,PcId,描述,类型)values({0})"
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
    ''' 判断sMother 中是否有 sTarget 不分大小写,sMother以逗号分割,找到匹配返回第一个匹配的位置，否则返回-1
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
    ''' 返回从左边删除指定长度剩下的字符串
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
    ''' 记录下程序运行错误详细信息
    ''' </summary>
    ''' <param name="errMsg">错误消息，主要是sql语句</param>
    ''' <param name="source">错误源，可以是发生错误的函数、过程、类</param>
    ''' <remarks></remarks>
    Public Shared Sub errProccss(ByVal errMsg As String, ByVal source As String)
        errMsg = Com.ValidStrForSql(errMsg)
        Dim uId As String = GetUserId()
        If String.IsNullOrEmpty(uId) Then uId = "-1"
        Dim sql As String = "insert into 错误报告(内容,来源,uID)values('{0}','{1}','" + uId + "')"
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
