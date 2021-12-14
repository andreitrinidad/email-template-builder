import { faEdit, faFileImport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RecursiveList = ({ data, options }) => {
    const {
        actions = [
            {
                actionTitle: '',
                action: () => { },
                actionIcon: false
            }
        ],
        showFilesOnly = false,
        activeVariant = false
    } = options;
    return data.map((item, i) => {
        if (item.kind === 'file') {
            return (
                <li key={i}
                    className={`flex items-center text-xs group pl-3 h-6 relative ${activeVariant == item.name ? 'bg-purple-600 text-white font-bold' : 'hover:bg-purple-50'}`}

                >
                    {item.name.split('.')[0]}
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 hidden group-hover:inline-flex items-center">

                        {
                            activeVariant == item.name ? (
                                <div title="Currently editing" className="w-6 h-6 inline-flex items-center justify-center cursor-pointer hover:bg-purple-600 text-white" >
                                    <FontAwesomeIcon icon={faEdit} className="" />
                                </div>
                            ) : (
                                <>
                                    <span className="flex text-2xs items-center font-bold leading-sm px-1 rounded-sm bg-purple-100 text-purple-600 mr-2">{item.name.split('.')[1]}</span>
                                    {
                                        actions.map(el => {
                                            const { actionIcon, action, actionTitle } = el;
                                            return (
                                                <div title={actionTitle} className="w-6 h-6 hidden  group-hover:inline-flex items-center justify-center cursor-pointer hover:bg-purple-600 text-purple-600 hover:text-white" onClick={() => action(item)} >
                                                    <FontAwesomeIcon icon={actionIcon} className="" />
                                                </div>
                                            )
                                        })
                                    }
                                </>
                            )
                        }


                    </div>
                </li>)
        }

        if (item.kind == 'directory') {
            if (showFilesOnly) return <RecursiveList data={item.files} options={options} />
            return <li className="text-xs" key={i}>
                <span className="block bg-gray-100 p-1 px-2 font-bold text-purple-600" >/{item.name}</span>

                <ul className="cursor-default">
                    <RecursiveList data={item.files} options={options} />
                </ul>
            </li>
        }
    })
};

export default RecursiveList;

