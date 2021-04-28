from abc import ABC, abstractmethod


class AbstractHandlerClass(ABC):

    def __init__(self,binaryfile,type):
        self.binaryfile = binaryfile
        self.type=type
        super().__init__()

    @abstractmethod
    def apply(self):
      pass



class HandlerClass(AbstractHandlerClass):
    def __init__(self, binaryfile, type):
        super().__init__(binaryfile,type)

    def applytext(self):

        return {"text":"text"}

    def applytei(self):
        return {"text": "text", "styleformat": {}}

    def apply(self):
        function_name = "apply" + self.type
        apply_method = getattr(HandlerClass, function_name)
        result = apply_method(self)
        print(result)
        #apply_method = getattr(C, "m")
        return result






