package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.LoanCreateDto;
import com.mohcine.banqueApp.dto.LoanResponseDTO;
import com.mohcine.banqueApp.dto.LoanUpdateDTO;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.User;
import com.mohcine.banqueApp.exception.ClientNotFoundException;
import com.mohcine.banqueApp.mapper.LoanMapper;
import com.mohcine.banqueApp.service.interfaces.LoanService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author USER
 **/
@Tag(name  = "cette endpoint permet la gestion des prets bancaire")
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

   @GetMapping("client/reference/{reference}")
    public List<LoanResponseDTO> getLoansByClientReference(@PathVariable String reference){
        List<Loan> loans = loanService.getLoansByClientReference(reference);

        return loans.stream().
                map(loanMapper::toDTO).
                toList();
   }

   // "My Loans" — always the authenticated client's own loans, never a
   // client-supplied reference, so a client can never read another
   // client's loan history.
   @GetMapping("/me")
    public List<LoanResponseDTO> getMyLoans(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        if (user.getClient() == null) {
            throw new ClientNotFoundException("(current user is not linked to a client)");
        }
        List<Loan> loans = loanService.getLoansByClientReference(user.getClient().getClientReference());

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
        Loan addedLoan  =  loanService.createLoan(loanCreateDto);
         return loanMapper.toDTO(addedLoan);
   }

   @PutMapping("/{id}")
    public LoanResponseDTO updateLoan(@PathVariable Integer id ,
                                      @RequestBody LoanUpdateDTO loanUpdateDTO ){

        Loan updatedLoan = loanService.updateLoan(id, loanUpdateDTO) ;
        return loanMapper.toDTO(updatedLoan) ;
   }

}
