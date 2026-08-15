package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.LoanCreateDto;
import com.mohcine.banqueApp.dto.LoanResponseDTO;
import com.mohcine.banqueApp.dto.LoanUpdateDTO;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.mapper.LoanMapper;
import com.mohcine.banqueApp.service.interfaces.LoanService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author USER
 **/
@RestController
@RequestMapping("api/v1/loans")

public class LoanController {

    private final LoanService loanService ;
    private final LoanMapper loanMapper ;

    public LoanController(LoanService loanService ,
                          LoanMapper loanMapper) {
        this.loanService = loanService ;
        this.loanMapper = loanMapper ;
    }

   @DeleteMapping("/{id}")
    public void deleteLoan(@PathVariable Integer id){
        loanService.deleteLoan(id);
   }

   @GetMapping("/{clientId}")
    public List<LoanResponseDTO> getLoansByClientId(@PathVariable Integer clientId){
        List<Loan> loans = loanService.getLoansByClientId(clientId);

        return loans.stream().
                map(loanMapper::toDTO).
                toList();
   }

   @GetMapping
   public List<LoanResponseDTO> getLoans(){
        List<Loan> loans = loanService.getAllLoans() ;
        return loans.stream().
                 map(loanMapper::toDTO).
                 toList();
   }

   @PostMapping
    public LoanResponseDTO createLoan(@RequestBody LoanCreateDto loanCreateDto) {
       Loan loan =   loanMapper.toEntity(loanCreateDto)  ;
        Loan addedLoan  =  loanService.addLoan(loan);
         return loanMapper.toDTO(addedLoan);
   }

   @PutMapping("/{id}")
    public LoanResponseDTO updateLoan(@PathVariable Integer id ,
                                      @RequestBody LoanUpdateDTO loanUpdateDTO ){

        Loan loan = loanMapper.updateEntity(loanUpdateDTO) ;
        Loan updatedLoan = loanService.updateLoan(loan) ;
        return loanMapper.toDTO(updatedLoan) ;
   }

}
