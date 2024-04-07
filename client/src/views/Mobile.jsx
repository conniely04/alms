import Prompt from '../components/Prompt'
import Map from '../components/Map'
import { useState } from 'react'
import { IoMdMap, IoIosChatboxes } from "react-icons/io";

export default function Web({messages, setMessages, longitude, setLongitude, latitude, setLatitude}) {

    const [view, setView] = useState('chat')

    function toggleView() {
        setView(view === 'chat' ? 'map' : 'chat')
    }

    return (
        <>
            <div className="relative flex flex-col h-full w-full p-[5%]">
                <div className="flex justify-between pb-5 border-b-2 border-white">
                    <div className='my-auto'>alms</div>
                    <div className='top-0 right-0 p-2 bg-slate-800 rounded-md' onClick={toggleView}>{
                        view === 'chat' ? <IoMdMap size={20} /> : <IoIosChatboxes size={20} />
                    }</div>
                </div> {/* TODO: CHANGE FONT */}
                {view === 'chat' ? <Prompt messages={messages} setMessages={setMessages} longitude={longitude} latitude={latitude} /> : <Map setLongitude={setLongitude} setLatitude={setLatitude} />}
            </div>
        </>
    )
}