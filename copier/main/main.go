package main

import (
	"fmt"
	"github.com/jinzhu/copier"
	"github.com/structmapper/structmapper"
	"reflect"
	"strconv"
)

func main() {
	ECopier()
	Example()
}

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Age  int32  `json:"age" structmapper:"description"`
	Role string
	Salary int
	Te     Tes
}

func (user *User) DoubleAge() int32 {
	return 2 * user.Age
}

type Employee struct {
	Name string `copier:"must"`
	Age int32 `copier:"must,nopanic"`
	Salary int `copier:"-"`
	DoubleAge int32
	EmployeId int64
	SuperRule string
	Te        *Test
}

type Test struct {
	A string
	B int
}

type Tes struct {
	A string
	B int
}


func (employee *Employee) Role(role string) {
	employee.SuperRule = "Super " + role
}

func ECopier() {
	var (
		user      = User{Name: "Jinzhu", Age: 18, Role: "Admin", Salary: 200000, Te: Tes{A: "A", B: 12}}
		users     = []User{{Name: "Jinzhu", Age: 18, Role: "Admin", Salary: 100000}, {Name: "jinzhu 2", Age: 30, Role: "Dev", Salary: 60000}}
		employee  = Employee{Salary: 150000}
		employees = []Employee{}
	)

	copier.Copy(&employee, &user)

	fmt.Printf("%#v \n", employee)
	fmt.Printf("%#v \n", employee.Te)
	// Employee{
	//    Name: "Jinzhu",           // Copy from field
	//    Age: 18,                  // Copy from field
	//    Salary:150000,            // Copying explicitly ignored
	//    DoubleAge: 36,            // Copy from method
	//    EmployeeId: 0,            // Ignored
	//    SuperRule: "Super Admin", // Copy to method
	// }

	// Copy struct to slice
	copier.Copy(&employees, &user)

	fmt.Printf("%#v \n", employees)
	// []Employee{
	//   {Name: "Jinzhu", Age: 18, Salary:0, DoubleAge: 36, EmployeId: 0, SuperRule: "Super Admin"}
	// }

	// Copy slice to slice
	employees = []Employee{}
	copier.Copy(&employees, &users)

	fmt.Printf("%#v \n", employees)
	// []Employee{
	//   {Name: "Jinzhu", Age: 18, Salary:0, DoubleAge: 36, EmployeId: 0, SuperRule: "Super Admin"},
	//   {Name: "jinzhu 2", Age: 30, Salary:0, DoubleAge: 60, EmployeId: 0, SuperRule: "Super Dev"},
	// }

	// Copy map to map
	map1 := map[int]int{3: 6, 4: 8}
	map2 := map[int32]int8{}
	copier.Copy(&map2, map1)

	fmt.Printf("%#v \n", map2)
	// map[int32]int8{3:6, 4:8}
}

type Node struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

func Example() {
	user := &User{
		ID:   "12345",
		Name: "山田太郎",
		Age:  32,
	}

	node := new(Node)

	err := structmapper.New().
		RegisterTransformer(
			structmapper.Target{
				From: reflect.TypeOf(int32(0)),
				To:   reflect.TypeOf(""),
			},
			func(from reflect.Value, _ reflect.Type) (reflect.Value, error) {
				if !from.IsValid() {
					return reflect.ValueOf(nil), nil
				}
				return reflect.ValueOf(strconv.FormatInt(from.Int(), 10)), nil
			},
		).
		From(user).
		CopyTo(node)
	if err != nil {
		panic(err)
	}

	fmt.Printf("User %+v\n", user)
	fmt.Printf("Node %+v\n", node)

	// Output:
	// User &{ID:12345 Name:山田太郎 Age:32}
	// Node &{Id:12345 Name:山田太郎 Description:32}
}
