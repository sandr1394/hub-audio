package service;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

public class Test123 {

    @Test
    public void test123() {
        List<String> filesToDelete = new ArrayList<>();
        process(filesToDelete);
        System.out.println(filesToDelete);



    }

    public void process(List<String> filesToDelete){
        String one = "1";
        String two = "2";
        String three = "3";
        String four = "4";
        String five = "5";

        filesToDelete.add(one);
        filesToDelete.add(two);
        filesToDelete.add(three);
        filesToDelete.add(four);
        filesToDelete.add(five);

    }
}
