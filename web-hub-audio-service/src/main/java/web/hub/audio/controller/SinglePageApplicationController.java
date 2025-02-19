package web.hub.audio.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SinglePageApplicationController {

    @RequestMapping(value = {"/", "/list/**", "/interactions", "/five9", "/server-error"})
    public String index(){
        return "/index";
    }
}
