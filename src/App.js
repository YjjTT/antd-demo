import React, { Component } from 'react';
import axios from 'axios'
import { Table, Select, Spin } from 'antd';
import './App.css';
import Assessment from './Assessment';

const columns = [{
  title: '序号',
  dataIndex: 'key',
  key: 'key',
},{
  title: '头像',
  dataIndex: 'avatar',
 key: 'avatar',
 render: text => < img id='img' src={text} />
}, {
  title: '姓名',
  dataIndex: 'realname',
  key: 'realname',
}, {
  title: '班级',
  dataIndex: 'grade_cn',
  key: 'grade_cn',
  render: (text, record) => (
    <span>{`${text}${record.cls_cn}`}</span>
  )
}, {
  title: '黄(态度)',
  dataIndex: 'attitude_level',
  key: 'attitude_level',
}, {
  title: '黑(技术)',
  dataIndex: 'technology_level',
  key: 'technology_level',
}, {
  title: '红(身体)',
  dataIndex: 'body_level',
  key: 'body_level',
}, {
  title: '蓝(意识)',
  dataIndex: 'mentality_level',
  key: 'mentality_level',
}, {
  title: '总',
  dataIndex: 'total_level',
  key: 'total_level',
}];

const Option = Select.Option

class App extends Component {

 constructor() {
  super()
  this.state = {
   data: [],
   classList: [],
   lessonList: [],
   periodList: [],
   loading: true
  }
 }

 componentDidMount() {
  this.loadData()
 }

// 请求全校排行榜
 loadData = () => {
  axios({
   method: 'get',
   url: 'https://watchman.ktfootball.com/kt-school/api/v5/schools/181/performance_rank?app_key=c196b0fe9794&limit=0'
  }).then((res) => {
   console.log(res.data)
   let list = res.data.data.map((item, index) => {
     return {
      ...item,
      key: index + 1
     }
   })
   this.setState({
    data: list
   })
  })
 }

// 请求班级
 loadClassData = () => {
  axios({
   method: 'get',
   url: 'https://watchman.ktfootball.com/kt-school/api/v5/schools/181/classrooms?app_key=c196b0fe9794&limit=0'
  }).then((res) => {
   let classList = res.data.data.map((item, index) => {
    return {
     ...item,
     key: index
    }
   })
   this.setState({ classList })
  })
 }

 // 请求课程
 loadLessData = (value) => {
  axios({
   method: 'get',
   url: `https://watchman.ktfootball.com/kt-school/api/v5/classrooms/${value}/lessons?app_key=c196b0fe9794&limit=0`
  }).then((res) => {
    this.loadPeriodData(res.data.data[0].id)
    let lessonList = res.data.data.map((item, index) => {
    return {
     ...item,
     key: index
    }
   })
   this.setState({ lessonList })
  })
 }

 // 请求课时
 loadPeriodData = (value) => {
  axios({
    method: 'get',
    url: `https://watchman.ktfootball.com/kt-school/api/v5/lessons/${value}/lesson_periods?app_key=c196b0fe9794&limit=0`
   }).then((res) => {
    let periodList = res.data.data.map((item, index) => {
     return {
      ...item,
      key: index
     }
    })
    this.setState({ periodList })
   })
 }
 // 请求课时排行榜
 loadPeriodRankData = (value) => {
  axios({
    method: 'get',
    url: `https://watchman.ktfootball.com/kt-school/api/v5/lesson_periods/${value}/performance_rank?app_key=c196b0fe9794&limit=0`
   }).then((res) => {
    let list = res.data.data.map((item, index) => {
     return {
      ...item,
      key: index
     }
    })
    this.setState({ data: list })
   })
 }

 handleClassChange = (value) => {
  this.loadLessData(value)
 }


 handlePeriodChange = (value) => {
  this.loadPeriodData(value)
 }

 handleRankChange = (value) => {
   this.setState({ loading: true });
   this.loadPeriodRankData(value)
 } 

 handleChange = (value) => {
  value === '学校' && this.loadData()
  value === '班级' && this.loadClassData()
 }

 render() {
  return (
   <div>
    <Select defaultValue='学校' onChange={this.handleChange}>
     <Option value='学校'>学校</Option>
     <Option value='班级'>班级</Option>
    </Select>
    {
     this.state.classList.length > 0 ? 
      <Select defaultValue={`${this.state.classList[0].grade_cn} ${this.state.classList[0].cls_cn}`} onChange={this.handleClassChange}>
       {
        this.state.classList.map((item, index) => <Option value={item.id} key={item.id}>{`${item.grade_cn} ${item.cls_cn}`}</Option>)
       }
      </Select> : <div></div>
    }


    {
     this.state.lessonList.length > 0 ? 
      <Select defaultValue={this.state.lessonList[0].name} onChange={this.handlePeriodChange}>
       {
        this.state.lessonList.map((item, index) => <Option value={item.id} key={item.id}>{item.name}</Option>)
       }
      </Select> : <div></div>
    }

    {
     this.state.periodList.length > 0 ? 
      <Select defaultValue={this.state.periodList[0].name} onChange={this.handleRankChange}>
       {
        this.state.periodList.map((item, index) => <Option value={item.id} key={item.id}>{item.name}</Option>)
       }
      </Select> : <div></div>
    }

    <Table className='table' columns={columns} dataSource={this.state.data} />
    {/* <Spin spinning={this.state.loading}></Spin> */}

    <Assessment />>

   </div>
  )
 }
}

export default App;