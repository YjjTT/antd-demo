import React, { Component } from 'react';
import axios from 'axios'
import { Table, Select, Spin, Button, Modal } from 'antd';
import './App.css';



const Option = Select.Option


class Assessment extends Component {

 constructor() {
    super()
    this.state = {
     data: [],
     skillList: [],
     classList: [],
     lessonList: [],
     periodList: [],
     skillId: '',
     visible: false,
     src: ''
    }
   }
  
handleChange = (value) => {
    value === '学校' && this.loadSkillData()
    value === '班级' && this.loadClassData()
}

handleSkillChange = (value) => {
    this.setState({ skillId: value })
    this.loadData(value)
}
// 请求全校排行榜
loadData = (value) => {
    axios({
     method: 'get',
     url: `/kt-school/api/v5/schools/11/skills/${value}/assessment_rank?app_key=c196b0fe9794&limit=0`
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

loadSkillData = () => {
    axios({
        method: 'get',
        url: '/kt-school/api/v6/assessments/schools/11/skills?app_key=c196b0fe9794&limit=0'
       }).then((res) => {
           this.setState({skillId: res.data.data[0].id})
        this.loadData(res.data.data[0].id)
        let skillList = res.data.data.map((item, index) => {
          return {
           ...item,
           key: index
          }
        })
        this.setState({ skillList })
       })
}
// 请求班级
loadClassData = () => {
    axios({
     method: 'get',
     url: '/kt-school/api/v5/schools/11/classrooms?app_key=c196b0fe9794&limit=0'
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
// 请求班级测评
loadRankData = (value) => {
    axios({
        method: 'get',
        url: `/kt-school/api/v5/classrooms/${value}/skills/${this.state.skillId}/assessment_rank?app_key=c196b0fe9794&limit=0`
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
       this.loadRankData(value)
   }

componentDidMount() {
    this.loadSkillData()
}

handleOnVideoClick = (text) => {
    this.setState({
        visible: true,
        src: text
    })
    console.log(text + '')
}

handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }


   render() {
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
        title: '完成数量',
        dataIndex: 'count',
        key: 'count',
      }, {
        title: '评级',
        dataIndex: 'rank',
        key: 'rank',
      }, {
        title: '评级视频',
        dataIndex: 'video',
        key: 'video',
          render: (text, record) => (
              <span>
                  <Button onClick={this.handleOnVideoClick.bind(this, text)}>{record.created_at}</Button>
              </span>
          )
      }];
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
       this.state.skillList.length > 0 ? 
        <Select defaultValue={this.state.skillList[0].name} onChange={this.handleSkillChange}>
         {
          this.state.skillList.map((item, index) => <Option value={item.id} key={item.id}>{item.name}</Option>)
         }
        </Select> : <div></div>
      }

      <Table className='table' columns={columns} dataSource={this.state.data} />
      <Modal visible={this.state.visible} closable={false} onOk={this.handleOk}
          onCancel={this.handleCancel} destroyOnClose={true}>
        <video width='100%' height='100%' controls>
            <source src={this.state.src} type='video/mp4' />
        </video>
      </Modal>
     </div>
    )
   }
}

export default Assessment;