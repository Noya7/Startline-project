const useLazy = async (isComponent, path, name) => {
    if(!isComponent){
        return ({params, request})=>import(path).then(module => module[name]({params, request}))
    }
}

export default useLazy;