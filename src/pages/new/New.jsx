import { useState } from "react"
import "./new.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { DriveFolderUploadOutlined } from "@mui/icons-material"
const New = ({ inputs, title })=>{

const [file, setFile] = useState('')


    return(
        <div className="new">
            <Sidebar/>
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img src={file ? URL.createObjectURL(file):"https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="" />
                    </div>
                    <div className="right">
                        <form action="">
                            {/* <div className="formInput">
                                <label htmlFor="file">
                                    Image: <DriveFolderUploadOutlined className="icon"/> 
                                </label>
                                <input type="file" id="file" onChange={e=>setFile(e.target.files[0])} style={{display:"none"}} />
                            </div>
                            {inputs.map((input)=>(
                            <div className="formInput" key={input.id}>
                            <label htmlFor="">{input.label}</label>
                            <input type={input.type} placeholder={input.placeholder} />
                            </div>
                            ))} */}

                            <div className="formInput">
                                <label htmlFor="">Email</label>
                                <input type="email" placeholder="Email"/>
                            </div>
                            <div className="formInput">
                                <label htmlFor="">Phone</label>
                                <input type="text" placeholder="+1-222-333" />
                            </div>
                            <div className="formInput">
                                <label htmlFor="">Password</label>
                                <input type="password" placeholder="password"/>
                            </div>
                            <div className="formInput">
                                <label htmlFor="">Address</label>
                                <input type="text" />
                            </div>
                            <div className="formInput">
                                <label htmlFor="">Country</label>
                                <input type="text" />
                            </div>

                            <button>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default New;