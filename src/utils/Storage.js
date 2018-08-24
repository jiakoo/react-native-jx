import {AsyncStorage} from 'react-native';

export default class Storage {

    /**
     *  获取 
     */
    static get(key){
            return AsyncStorage.getItem(key).then(value=>{
                //JSON 字符串转换为对象
                const  jsonValue  = JSON.parse(value);
                return jsonValue;
            })
        }

    /**
     * 保存
     */

    static save(key,value){
        return AsyncStorage.setItem(key, JSON.stringify(value));
     }


     /**
      * 叠加更新
      */

     static update(key, value) {
        return Storage.get(key).then((item) => {
            value = typeof value === 'string' ? value : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        });
    }

    /**
     * 删除
     */

    static delete(key) {
         return AsyncStorage.removeItem(key);
    }

    /**
     * 清空
     */

    static  clear(){
        return AsyncStorage.clear();
    }

}


/** 用法
 *   getStorage=()=>{
        Storage.get(Num).then(num=>{
            this.setState({
                num:num
            })
        })
    }

    saveStorage=()=>{
        var num = parseInt(this.state.num);
        ++num;
        Storage.save(Num,num).then(
            Storage.get(Num).then(num=>{
                Number(num)
                this.setState({
                    num:num
                })
            })
        )       
    }

    delStorage=()=>{
        Storage.delete(Num).then(
            Storage.get(Num).then(num=>{
                this.setState({
                    num:num
                })
            })   
        )
    }
 * 
 */