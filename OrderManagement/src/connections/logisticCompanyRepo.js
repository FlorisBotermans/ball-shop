class Company{
    constructor(name,price)
    {
        this.name = name
        this.price = price
    }
}

const companies = [new Company("PostNL","3.95"),new Company("DHL","9.95"),new Company("UPS","5.95")]

class logisticCompanyRepo{
    constructor()
    {

    }
    getCompanies() {
        return companies
    }
    getCheapestCompanies(){
        let cheapestCompany = null
        for(const company of companies)
        {
            console.log(company)
            if(!cheapestCompany){
                cheapestCompany = company
            }
            else{
                if(company.price < cheapestCompany.price)
                {
                    cheapestCompany = company
                }
            }
        }
        return cheapestCompany
    }
}

module.exports = logisticCompanyRepo