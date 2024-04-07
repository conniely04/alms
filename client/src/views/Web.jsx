import Prompt from '../components/Prompt'
import Map from '../components/Map'

export default function Web() {

    return (
        <>
            <div className='flex flex-col relative h-full w-full'>
                <div className='flex justify-between p-5 border-b-2 border-white'>
                    <div className='my-auto'>alms</div>
                </div>
                <div className='absolute z-10 p-5 left-[5%] bottom-[10%] bg-slate-900 overflow-hidden rounded-2xl border-2 h-[50%] max-h-96 w-[30%] max-w-[35rem] min-w-[24rem]'>
                    <Prompt />
                </div>
                <div className='flex-1'>

                    <Map />
                </div>
            </div>
        </>
    )
}