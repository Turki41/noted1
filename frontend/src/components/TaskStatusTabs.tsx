
const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }: any) => {
    return (
        <div className="">
            <div className="flex">
                {tabs.map((tab: any) => (
                    <button key={tab.name} className={`relative px-3 py-2 md:px-4 text-sm font-medium ${activeTab == tab.label ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab(tab.label)}>
                        <div className="flex items-center">
                            <span>{tab.label}</span>
                            <span className={`text-sm ml-2 px-2 py-0.5 rounded-full ${activeTab == tab.label ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}>
                                {tab.count}
                            </span>
                        </div>
                        
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TaskStatusTabs