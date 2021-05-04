from abc import ABC, abstractmethod
import json

from .TEI import TeiReader


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
        reader = TeiReader()
        if isinstance(self.binaryfile, str):
            text = self.binaryfile
        else:
            text = self.binaryfile.read().decode("utf-8")
        items = []

        corpus = reader.read_string(text)
        for doc in corpus.documents:
            content = doc.text
            content.iterate()
            items.append({"text":  content.text_with_notes,
                          "marks": [x.to_dict() for x in content.marks_with_notes]})
        return {"documents": items}

    def apply(self):
        function_name = "apply" + self.type
        apply_method = getattr(HandlerClass, function_name)
        result = apply_method(self)
        #apply_method = getattr(C, "m")
        return result






