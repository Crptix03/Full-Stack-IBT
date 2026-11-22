using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.Validation;

public class ETBAmountAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is null)
            return ValidationResult.Success;
        if(value is not decimal amount || amount <= 0m)
        {
            return new ValidationResult("Amount must be greater than zero.");
        }

        if(decimal.Round(amount, 2) != amount)
        {
            return new ValidationResult("Amount cannot have more that two decimal places.");
        }

        return ValidationResult.Success;
    }
}