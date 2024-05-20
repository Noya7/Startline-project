import { useEffect } from "react";
import { useNavigation } from "react-router-dom"
import { toast } from "react-toastify";

const useResponseToast = (responseData) =>{
    const navigation = useNavigation()
    useEffect(() => {
        if (navigation.state === 'idle' && responseData) {
          responseData.error?.message && toast.error(responseData.error.message);
          responseData.payload?.message && toast.success(responseData.payload.message);
          }
      }, [navigation.state, responseData]);
}

export default useResponseToast;