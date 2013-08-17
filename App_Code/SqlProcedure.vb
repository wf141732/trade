Imports System.Data.SqlClient
Imports System.Data
Imports Com
Namespace aac
    Public Class SqlResult
        Public Value As Integer
        Public Output As Hashtable
        Public dt As DataTable

        Public Sub New()
            Value = 0
            Output = New Hashtable
            dt = New DataTable
        End Sub
    End Class

    Public Class SqlProcedure
        ' 调用存储过程的通用方法
        Private mCn As SqlConnection
        Private mCmd As SqlCommand
        Private p As SqlParameter
        Private _returnData As Boolean ' 是否返回data,true: 设置dr
        Private sp_name As String
        Private mconstr As String ' 连接字符串

        Public Property ProcedureName() As String ' 存储过程名
            Get
                Return sp_name
            End Get
            Set(ByVal value As String)
                sp_name = value
            End Set
        End Property

        Public Property constr() As String ' 连接字符串
            Get
                Return ""
            End Get
            Set(ByVal value As String)
                mconstr = value
            End Set
        End Property

        Public Sub New(ByVal sp_name As String, Optional ByVal returnData As Boolean = False, Optional ByVal constr As String = "")
            Me.ProcedureName = sp_name
            _returnData = returnData
            If String.IsNullOrEmpty(constr) Then
                mconstr = Com.GetConnectStr
            Else
                mconstr = constr
            End If
        End Sub



        Public Function callPro(ByVal parameters() As String) As SqlResult ' 调用存储过程
            Dim result As New SqlResult
            mCn = New SqlConnection(mconstr)
            Try
                mCn.Open()
                mCmd = New SqlCommand(Me.ProcedureName, mCn)
                mCmd.CommandType = CommandType.StoredProcedure
                GetProcedureParameter(parameters)
                If _returnData Then
                    Dim myAdapter As SqlDataAdapter = New SqlDataAdapter(mCmd)
                    myAdapter.Fill(result.dt)
                Else
                    mCmd.ExecuteNonQuery()
                End If
                GetOutputValue(result)
            Catch ex As Exception ' 错误处理
                Com.errProccss(ex.Message, "callPro|" + sp_name)
            Finally
                mCmd.Dispose()
                mCn.Close()
                mCn.Dispose()
            End Try
            Return result
        End Function


        Private Sub GetProcedureParameter(ByVal parameters() As String)
            Dim sql As String = "select DATA_TYPE,PARAMETER_MODE,PARAMETER_NAME,NUMERIC_PRECISION,NUMERIC_SCALE,CHARACTER_MAXIMUM_LENGTH from INFORMATION_SCHEMA.PARAMETERS where SPECIFIC_NAME='" _
            + Me.ProcedureName + "' order by ORDINAL_POSITION"
            Dim i As Integer
            Dim cmd As New SqlCommand(sql, mCn)
            Dim dr As SqlDataReader = cmd.ExecuteReader
            Dim p As New SqlParameter
            With p
                .ParameterName = "@Value"
                .SqlDbType = SqlDbType.Int
                .Direction = ParameterDirection.ReturnValue
            End With
            mCmd.Parameters.Add(p)
            Do While dr.Read
                p = New SqlParameter
                p.ParameterName = dr("PARAMETER_NAME").ToString()
                If dr("PARAMETER_MODE").ToString() = "IN" Then
                    p.Direction = ParameterDirection.Input
                Else
                    p.Direction = ParameterDirection.Output
                End If

                Select Case dr("DATA_TYPE").ToString()
                    Case "bit"
                        If p.Direction = ParameterDirection.Input Then p.Value = CBool(parameters(i))
                        p.SqlDbType = SqlDbType.Bit
                    Case "bigint"
                        If p.Direction = ParameterDirection.Input Then p.Value = myCInt(parameters(i))
                        p.SqlDbType = SqlDbType.BigInt

                    Case "int"
                        If p.Direction = ParameterDirection.Input Then p.Value = myCInt(parameters(i))
                        p.SqlDbType = SqlDbType.Int
                    Case "tinyint"
                        If p.Direction = ParameterDirection.Input Then p.Value = myCInt(parameters(i))
                        p.SqlDbType = SqlDbType.TinyInt
                    Case "smallint"
                        If p.Direction = ParameterDirection.Input Then p.Value = myCInt(parameters(i))
                        p.SqlDbType = SqlDbType.SmallInt
                    Case "float"
                        If p.Direction = ParameterDirection.Input Then p.Value = myCFloat(parameters(i))
                        p.SqlDbType = SqlDbType.Float
                    Case "money"
                        If p.Direction = ParameterDirection.Input Then p.Value = myCFloat(parameters(i))
                        p.SqlDbType = SqlDbType.Money
                    Case "smallmoney"
                        If p.Direction = ParameterDirection.Input Then p.Value = myCFloat(parameters(i))
                        p.SqlDbType = SqlDbType.SmallMoney

                    Case "decimal"
                        If p.Direction = ParameterDirection.Input Then p.Value = parameters(i)
                        p.SqlDbType = SqlDbType.Decimal
                        p.Precision = dr("NUMERIC_PRECISION")
                        p.Scale = dr("NUMERIC_SCALE")

                    Case "nvarchar"
                        If p.Direction = ParameterDirection.Input Then p.Value = myCStr(parameters(i))
                        p.Size = dr("CHARACTER_MAXIMUM_LENGTH")
                        p.SqlDbType = SqlDbType.NVarChar
                    Case "varchar"
                        If p.Direction = ParameterDirection.Input Then p.Value = myCStr(parameters(i))
                        p.Size = dr("CHARACTER_MAXIMUM_LENGTH")
                        p.SqlDbType = SqlDbType.VarChar

                    Case "nchar"
                        If p.Direction = ParameterDirection.Input Then p.Value = myCStr(parameters(i))
                        p.Size = dr("CHARACTER_MAXIMUM_LENGTH")
                        p.SqlDbType = SqlDbType.NChar
                    Case "char"
                        If p.Direction = ParameterDirection.Input Then p.Value = parameters(i)
                        p.Size = dr("CHARACTER_MAXIMUM_LENGTH")
                        p.SqlDbType = SqlDbType.Char
                    Case "ntext"
                        If p.Direction = ParameterDirection.Input Then p.Value = parameters(i)
                        p.SqlDbType = SqlDbType.NText

                    Case "text"
                        If p.Direction = ParameterDirection.Input Then p.Value = parameters(i)
                        p.SqlDbType = SqlDbType.Text
                    Case "datetime"
                        If p.Direction = ParameterDirection.Input Then p.Value = parameters(i)
                        p.SqlDbType = SqlDbType.DateTime

                    Case "date"
                        If p.Direction = ParameterDirection.Input Then p.Value = parameters(i)
                        p.SqlDbType = SqlDbType.DateTime

                    Case "smalldatetime"
                        If p.Direction = ParameterDirection.Input Then p.Value = parameters(i)
                        p.SqlDbType = SqlDbType.SmallDateTime
                    Case "uniqueidentifier"
                        p.SqlDbType = SqlDbType.UniqueIdentifier
                End Select
                i += 1
                mCmd.Parameters.Add(p)
            Loop

            '关闭dr
            dr.Close()
            cmd.Dispose()
        End Sub

        Private Function myCStr(ByVal str As String) As String
            If String.IsNullOrEmpty(str) Then str = ""
            Return str
        End Function

        Private Function myCInt(ByVal str As String) As Integer
            Try
                Return CInt(str)
            Catch ex As Exception
                Return 0
            End Try
        End Function

        Private Function myCFloat(ByVal str As String) As Single
            Try
                Return CSng(str)
            Catch ex As Exception
                Return 0
            End Try
        End Function

        Private Sub GetOutputValue(ByRef result As SqlResult)
            result.Value = CInt(mCmd.Parameters("@Value").Value)
            For Each p As SqlParameter In mCmd.Parameters
                If p.Direction = ParameterDirection.Output Then result.Output.Add(p.ParameterName, p.Value)
            Next
        End Sub
    End Class
End Namespace
