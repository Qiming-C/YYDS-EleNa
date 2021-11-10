package yyds.Backend.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @ClassName: yyds.Backend.Controller
 * @Project: Backend
 * @Author: qimingchen on 11/9/21
 */
@RestController
public class MapController {


    @GetMapping("/")
    public String index(){
        return "Greeting FROM YYDS!";
    }


}
